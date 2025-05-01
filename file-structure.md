
# FOLDER STRUCTURE

│
├── app/                                                # App entry point logic (App.tsx usually lives here)
│
├── src/
│   ├── navigation/                                     # All navigation logic (stack, tab, drawer, etc.)
│   │   ├── index.tsx                                   # Root Navigator (AppNavigator)
│   │   ├── AuthNavigator.tsx                           # Auth stack
│   │   ├── MainNavigator.tsx                           # Main app stack
│   │   └── types.ts                                    # Typed route definitions
│   │
│   ├── screens/                                        # Screen components grouped by feature
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   └── index.ts                                # Export auth screens
│   │   │
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── Profile/
│   │       ├── ProfileScreen.tsx
│   │       └── index.ts
│   │
│   ├── components/                                     # Shared/reusable UI components
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   │
│   ├── features/                                       # Business logic and states, grouped by domain
│   │   ├── auth/
│   │   │   ├── authSlice.ts
│   │   │   ├── authApi.ts
│   │   │   └── ...
│   │   ├── user/
│   │   │   ├── userSlice.ts
│   │   │   ├── userApi.ts
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── services/                                         # API clients, analytics, etc.
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   └── ...
│   │
│   ├── hooks/                                          # Reusable hooks (e.g., useAuth, useDebounce)
│   │   └── useAuth.ts
│   │
│   ├── utils/                                          # Utility functions and helpers
│   │   └── formatDate.ts
│   │
│   ├── constants/                                      # App-wide constants (routes, colors, etc.)
│   │   ├── Colors.ts
│   │   ├── Routes.ts
│   │   └── ...
│   │
│   ├── assets/                                         # Static assets (images, fonts, etc.)
│   │   ├── images/
│   │   ├── fonts/
│   │   └── ...
│   │
│   └── theme/                                          # Theming (colors, spacing, etc.)
│       └── index.ts
│
├── .env                                                # Environment variables
├── package.json
├── tsconfig.json
├── .eslint.js
├── .prettierrc.js
├── .gitignore
├── app.json
├── yarn.lock
├── metro.config.js
├── jest.config.js
├── babel.config.js
├── index.js
├── .watchmanconfig
├── Gemfile
├── Gemfile.lock
├── react-native.config.js
├── file-structure.md
