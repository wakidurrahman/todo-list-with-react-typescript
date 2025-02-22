# Todo List application

This project is mainly for studying AI and practicing related concepts. where I will try to implement some apps with AI.

## Stating a project from scratch with AI.

1. Step 1: command Prompt for building a Todo List application.

   ```text
    Build a Todo List application with the following specifications:

    Technical Requirements:
    - React.js with TypeScript
    - Vite as build tool
    - Bootstrap for styling
    - sass

   ```

2. Step 2: command Prompt for building a Todo List features.

   ```text
   I want to build a Todo List application with the following specifications:

   Coding Structure
    - Follow the Atomic Design folder structure.
    - Use Atoms (e.g., Button, TodoItem), Molecules (e.g., TodoList), and Organisms.
    - Components will be built using Bootstrap class names and structure.
    - The component structure to follow the latest React documentation style with function components.

   Core Features
    - Add new todos with a title and description.
    - Edit existing todos (using an icon button).
    - Delete todos (using an icon button).
    - View a list of all todos.
    - Persist data using the browser's local storage.

    Please help me implement this application following best practices and clean code principles."
   ```

3. Step 3: command Prompt for setting up the project unit testing and snapshot testing.

   ```text

    I want to set up unit testing for the project with the following specifications:
    - Testing Framework: Jest
    - Testing Library: React Testing Library
    - Snapshot Testing: Ensures UI consistency, with snapshots stored in the __snapshots__ folder
    - Code Coverage: Coverage reports stored in the coverage folder
    - Dependency Check: Verify my package.json file to ensure the correct testing dependencies are set up.

    Please implement this setup following best practices
   ```

4. Step 4: command Prompt for setting up the project linting and type checking.

   ```text
   Implement test cases for both the components and utils folders:

    - Snapshot testing for the components folder.
    - Unit testing for the components folder.
    - Do not create a __test__ folder; instead, place test files directly inside their respective folders.
   ```

## apps persistence

- Local storage
- Jsonplaceholder api
- Inmemory database

---

# React + TypeScript + Vite

Now your project is set up with production-ready linting and type checking. Here's what we've added:

1. ✅ ESLint Configuration:

- Strict TypeScript rules with strict-type-checked
- Stylistic TypeScript rules with stylistic-type-checked
- React and React Hooks specific rules
- Custom rules for better code quality
- Integration with TypeScript's type checker

2. ✅ Package.json Updates:

- Added all necessary ESLint dependencies
- Added Prettier for code formatting
- Added new scripts:
  - lint: Run ESLint with strict settings
  - format: Format code with Prettier
  - type-check: Run TypeScript type checking

3. ✅ Prettier Configuration:

- Consistent code formatting rules
- Integration with ESLint

4. ✅ TypeScript Configuration:

- Strict type checking enabled
- Additional strict rules for better type safety
- Modern ECMAScript features
- React JSX support

5. ✅ This testing setup provides:

- Full TypeScript support
- Snapshot testing
- Code coverage reporting
- React Testing Library best practices
- Jest DOM matchers
- User event simulation
- Mocked localStorage
- Comprehensive component and utility testing
- Continuous Integration ready configuration

6. ✅ The tests cover:

- Component rendering
- Form validation
- User interactions
- Error states
- Success states
- Utility functions
- Edge cases

## File Structure

```
src/
├── components/
│ ├── TodoList.tsx
│ ├── TodoItem.tsx
│ └── AddTodo.tsx
├── styles/
│ └── main.scss
├── types/
│ └── todo.ts
├── App.tsx
└── main.tsx

```

## Run the project

```bash
# Development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Todo List project Features

### 📌 Core Features (Essential)

- [x] ✅ Add Todo: Create a new task with a title and description.
- [x] 📝 Edit Todo: Modify an existing task.
- [x] ❌ Delete Todo: Remove a task from the list.
- [x] 📃 View Todo List: Display all tasks.
- [x] 💾 Local Storage Persistence: Save and load todos from local storage.

### 🚀 Additional Features (To Enhance Functionality)

- [ ] 📅 Due Dates: Add and display deadlines for each task.
- [ ] 🎨 Task Priority: Set high, medium, or low priority for tasks.
- [ ] ✅ Task Completion Toggle: Mark tasks as complete/incomplete.
- [ ] 🔍 Search Functionality: Search todos by keyword.
- [ ] 📂 Filter & Sort: Filter tasks by status (completed, pending) or sort by date/priority.

### 💡 UI/UX Enhancements

- [ ] 💡 Dark Mode: Add a dark/light mode toggle.
- [ ] 🖱️ Drag-and-Drop Reordering: Allow users to reorder tasks.
- [ ] 📊 Task Progress Bar: Show how many tasks are completed.
- [ ] 🛑 Confirmation Prompt: Ask for confirmation before deleting a task.

### 🛡️ Advanced Features

- [ ] 🧪 Undo/Redo Functionality: Revert changes or restore deleted tasks.
- [ ] 🧵 Tags or Categories: Group tasks by categories.
- [ ] 🔔 Notifications: Remind users of overdue tasks.
- [ ] 🧩 Subtasks: Add smaller steps under a main task.
