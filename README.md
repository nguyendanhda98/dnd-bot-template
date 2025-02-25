```
├── node_modules/
├── src/
│   ├── commands/                   // Tất cả các lệnh bot
│   │   ├── slash/                  // Slash Commands (được đăng ký tự động qua API Discord)
│   │   │   ├── general/            // Các lệnh chung cho mọi người dùng
│   │   │   │   ├── ping.ts
│   │   │   │   └── help.ts
│   │   │   └── admin/              // Các lệnh dành riêng cho quản trị viên
│   │   │       └── ban.ts
│   │   ├── context/                // Context Menu Commands (lệnh cho message/user)
│   │   │   ├── userContext.ts
│   │   │   └── messageContext.ts
│   │   └── legacy/                 // (Nếu cần) Lệnh dùng prefix cũ
│   │       └── legacyCommand.ts
│   │
│   ├── events/                     // Các sự kiện của Discord
│   │   ├── client/                 // Các sự kiện liên quan đến client (ready, error, warn, disconnect,…)
│   │   │   ├── ready.ts
│   │   │   ├── error.ts
│   │   │   └── warn.ts
│   │   ├── message/                // Các sự kiện liên quan đến tin nhắn
│   │   │   └── messageCreate.ts
│   │   └── interaction/            // Sự kiện cho các tương tác (slash, button, select,…)
│   │       └── interactionCreate.ts
│   │
│   ├── interactions/               // Xử lý cụ thể các tương tác không thuộc lệnh
│   │   ├── buttons/                // Xử lý các button click
│   │   │   └── voteButton.ts
│   │   ├── modals/                 // Xử lý modal (form nhập liệu)
│   │   │   └── feedbackModal.ts
│   │   └── selectMenus/            // Xử lý các select menu
│   │       └── roleSelect.ts
│   │
│   ├── services/                   // Các module hỗ trợ ngoài core bot
│   │   ├── database/               // Các dịch vụ liên quan đến cơ sở dữ liệu
│   │   │   ├── prisma.ts           // Ví dụ: nếu dùng Prisma ORM
│   │   │   └── mongo.ts            // Hoặc nếu dùng MongoDB
│   │   ├── api/                    // Tích hợp với các API bên ngoài (ví dụ Weather API,…)
│   │   │   └── weatherAPI.ts
│   │   └── scheduler/              // Các tác vụ nền, công việc định kỳ
│   │       └── dailyTask.ts
│   │
│   ├── structures/                 // Các lớp mở rộng (Extended classes) cho Sapphire hoặc Discord.js
│   │   ├── ExtendedClient.ts       // Ví dụ: mở rộng SapphireClient với các tính năng tùy chỉnh
│   │   └── ExtendedCommand.ts      // Mở rộng lệnh nếu cần thêm tính năng chung
│   │
│   ├── loaders/                    // Module tự động load các lệnh, sự kiện,... (nếu bạn muốn custom loader)
│   │   └── index.ts
│   │
│   ├── config/                     // Các cấu hình, hằng số và thiết lập môi trường
│   │   ├── config.ts               // Cấu hình tổng quát (ví dụ: prefix, ID các kênh,…)
│   │   ├── constants.ts            // Các hằng số sử dụng chung
│   │   └── environment.ts          // Xử lý các biến môi trường, kiểm tra cấu hình
│   │
│   ├── utils/                      // Các tiện ích, helper functions, logger, error handler,...
│   │   ├── logger.ts               // Hệ thống log riêng, có thể mở rộng
│   │   ├── formatter.ts            // Các hàm format tin nhắn, embed, thời gian,...
│   │   └── errorHandler.ts         // Xử lý lỗi chung cho toàn bot
│   │
│   ├── types/                      // Các type, interface hoặc declaration cho TypeScript
│   │   └── index.d.ts              // Các khai báo mở rộng hoặc type custom
│   │
│   └── index.ts                    // File entry point của bot
├── .env                            // File chứa các biến môi trường (TOKEN, API keys,…)
├── .gitignore
├── package.json
└── tsconfig.json
```