import fs from "fs";
import path from "path";
import { ExtendedClient } from "../structures/ExtendedClient";
import { logger } from "../utils/logger";
import { REST } from "discord.js";
import { Routes } from "discord-api-types/v10";
import { config } from "../config/config";

// Load event handlers
export const loadEvents = async (client: ExtendedClient) => {
  const eventFolders = fs.readdirSync(path.join(__dirname, "../events"));

  for (const folder of eventFolders) {
    const eventFiles = fs
      .readdirSync(path.join(__dirname, "../events", folder))
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of eventFiles) {
      const eventModule = require(path.join(
        __dirname,
        "../events",
        folder,
        file
      ));
      const event = eventModule.default || eventModule;

      if (!event.name || typeof event.execute !== "function") {
        logger.warn(
          `Event at ${file} is missing required "name" or "execute" property`
        );
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }

      logger.info(`Loaded event: ${event.name}`);
    }
  }
};

// Load legacy commands
export const loadLegacyCommands = async (client: ExtendedClient) => {
  const legacyCommandsPath = path.join(__dirname, "../commands/legacy");
  const commandFiles = fs
    .readdirSync(legacyCommandsPath)
    .filter(
      (file) =>
        (file.endsWith(".ts") || file.endsWith(".js")) &&
        file !== "legacyCommand.ts"
    );

  for (const file of commandFiles) {
    const commandModule = require(path.join(legacyCommandsPath, file));
    const command = commandModule.default || commandModule;

    if (command && command.name && typeof command.execute === "function") {
      // Register main command
      client.legacyCommands.set(command.name, command);

      // Register aliases if they exist
      if (command.aliases && Array.isArray(command.aliases)) {
        command.aliases.forEach((alias: string) => {
          client.legacyCommands.set(alias, command);
        });
      }

      logger.info(`Loaded legacy command: ${command.name}`);
    } else {
      logger.warn(`Legacy command at ${file} is missing required properties`);
    }
  }
};

// Load context menu commands
export const loadContextCommands = async (client: ExtendedClient) => {
  const contextCommandsPath = path.join(__dirname, "../commands/context");
  const commandArray = [];

  try {
    // Kiểm tra nếu thư mục tồn tại
    if (fs.existsSync(contextCommandsPath)) {
      const commandFiles = fs
        .readdirSync(contextCommandsPath)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

      for (const file of commandFiles) {
        const commandModule = require(path.join(contextCommandsPath, file));
        const command = commandModule.default || commandModule;

        if (command && command.data && typeof command.execute === "function") {
          // Thêm command vào client collection
          client.commands.set(command.data.name, command);
          // Thêm command data để đăng ký với API
          commandArray.push(command.data.toJSON());
          logger.info(`Loaded context command: ${command.data.name}`);
        } else {
          logger.warn(`Context command at ${file} is missing required properties`);
        }
      }
    }
  } catch (error) {
    logger.error("Error loading context commands:", error);
  }

  return commandArray;
};

// Load slash commands
export const loadCommands = async (client: ExtendedClient) => {
  const commandFolders = fs.readdirSync(path.join(__dirname, '../commands/slash'));
  const commandsArray = [];
  
  // Load slash commands first
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, '../commands/slash', folder))
      .filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const commandModule = require(path.join(__dirname, '../commands/slash', folder, file));
      const command = commandModule.default || commandModule;
      
      if (command && command.data && typeof command.execute === 'function') {
        client.commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());
        logger.info(`Loaded command: ${command.data.name}`);
      } else {
        logger.warn(`Command at ${file} is missing required "data" or "execute" property`);
      }
    }
  }
  
  // Load context menu commands and add them to the commandsArray
  const contextCommands = await loadContextCommands(client);
  if (contextCommands && contextCommands.length > 0) {
    commandsArray.push(...contextCommands);
  }
  
  // Register commands with Discord API
  const rest = new REST({ version: '10' }).setToken(config.token);
  
  try {
    logger.info('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildIdTest),
      { body: commandsArray }
    );
    
    logger.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.error('Failed to refresh application commands:', error);
  }

  return commandsArray;
};

// Load interactions (buttons, select menus, modals)
export const loadInteractions = async (client: ExtendedClient) => {
  // Load buttons
  const buttonFiles = fs.readdirSync(path.join(__dirname, '../interactions/buttons'))
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  
  for (const file of buttonFiles) {
    const buttonModule = require(path.join(__dirname, '../interactions/buttons', file));
    const button = buttonModule.default || buttonModule;
    
    if (button && button.id && typeof button.execute === 'function') {
      client.buttons.set(button.id, button);
      logger.info(`Loaded button: ${button.id}`);
    } else {
      logger.warn(`Button at ${file} is missing required "id" or "execute" property`);
    }
  }
  
  // Load select menus
  const selectMenuFiles = fs.readdirSync(path.join(__dirname, '../interactions/selectMenus'))
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  
  for (const file of selectMenuFiles) {
    const menuModule = require(path.join(__dirname, '../interactions/selectMenus', file));
    const selectMenu = menuModule.default || menuModule;
    
    if (selectMenu && selectMenu.id && typeof selectMenu.execute === 'function') {
      client.selectMenus.set(selectMenu.id, selectMenu);
      logger.info(`Loaded select menu: ${selectMenu.id}`);
    } else {
      logger.warn(`Select menu at ${file} is missing required "id" or "execute" property`);
    }
  }
  
  // Load modals
  const modalFiles = fs.readdirSync(path.join(__dirname, '../interactions/modals'))
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  
  for (const file of modalFiles) {
    const modalModule = require(path.join(__dirname, '../interactions/modals', file));
    const modal = modalModule.default || modalModule;
    
    if (modal && modal.id && typeof modal.execute === 'function') {
      client.modals.set(modal.id, modal);
      logger.info(`Loaded modal: ${modal.id}`);
    } else {
      logger.warn(`Modal at ${file} is missing required "id" or "execute" property`);
    }
  }
};
