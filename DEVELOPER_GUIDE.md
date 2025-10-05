# Developer Quick Start Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Common Tasks](#common-tasks)
5. [Code Examples](#code-examples)
6. [Troubleshooting](#troubleshooting)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## Getting Started

### Prerequisites

- **Node.js**: v8.x or higher
- **npm**: v5.x or higher
- **MySQL**: v5.7 or higher
- **Git**: Latest version

### Initial Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd community-app
   ```

2. **Install Dependencies**
   ```bash
   # Install all dependencies (frontend + server)
   npm install
   
   # Or install separately
   cd server && npm install
   cd ../frontend && npm install
   ```

3. **Configure Database**
   
   Create MySQL database:
   ```sql
   CREATE DATABASE `community-app` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   
   Update server configuration:
   ```javascript
   // server/src/config/dbconfig.ts
   export const dbConfig = {
     host: 'localhost',
     user: 'root',
     password: 'your_password',
     database: 'community-app'
   };
   ```

4. **Configure Backend Path**
   
   Update frontend configuration:
   ```json
   // frontend/src/config.json
   {
     "backEndPath": {
       "schema": "http",
       "host": "localhost",
       "port": 3001
     }
   }
   ```

5. **Start Development**
   ```bash
   # Start both frontend and backend
   npm start
   
   # Or start separately
   cd server && npm start     # Runs on port 3001
   cd frontend && npm start   # Runs on port 3000
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

---

## Project Structure

```
community-app/
│
├── server/                      # Backend Node.js application
│   ├── src/
│   │   ├── controller/          # REST API controllers
│   │   │   ├── user.controller.ts
│   │   │   ├── game.controller.ts
│   │   │   ├── events.controller.ts
│   │   │   └── ...
│   │   ├── service/             # Business logic services
│   │   │   ├── user-authentication/
│   │   │   ├── games/
│   │   │   ├── statistic/
│   │   │   └── ...
│   │   ├── validation/          # Input validation
│   │   └── config/              # Configuration files
│   ├── models/                  # Sequelize database models
│   ├── Interfaces/              # TypeScript interfaces
│   ├── errors/                  # Error definitions
│   └── package.json
│
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── LoginForm/
│   │   │   ├── GameCard/
│   │   │   ├── Mui/            # Material-UI wrappers
│   │   │   └── ...
│   │   ├── store/               # Redux store modules
│   │   │   ├── auth/
│   │   │   ├── games/
│   │   │   ├── statistic/
│   │   │   └── ...
│   │   ├── services/            # API services
│   │   ├── utils/               # Utility functions
│   │   ├── scenes/              # Page components
│   │   ├── models.ts            # TypeScript models
│   │   └── index.tsx            # Entry point
│   ├── public/                  # Static assets
│   └── package.json
│
├── acceptance_tests/            # End-to-end tests
├── package.json                 # Root package.json
└── README.md
```

---

## Development Workflow

### 1. Create a New Feature Branch

```bash
git checkout -b feature/my-new-feature
```

### 2. Make Your Changes

Follow the coding standards and patterns established in the codebase.

### 3. Test Your Changes

```bash
# Run server tests
cd server && npm test

# Run frontend tests
cd frontend && npm test
```

### 4. Lint Your Code

```bash
# Lint server code
cd server && npm run lint

# Lint frontend code
cd frontend && npm run lint

# Auto-fix linting issues
npm run tslint-fix
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Commit message conventions:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tooling changes

### 6. Push and Create Pull Request

```bash
git push origin feature/my-new-feature
```

---

## Common Tasks

### Adding a New REST API Endpoint

**1. Create Controller Method**

```typescript
// server/src/controller/my.controller.ts
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';

@controller('/api/my-resource')
export class MyController {
  constructor(@inject(MyService) private myService: MyService) {}
  
  @httpGet('/get-data')
  public async getData(req: Request, res: Response): Promise<void | Response> {
    try {
      const data = await this.myService.getData();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  
  @httpPost('/create')
  public async createData(req: Request, res: Response): Promise<void | Response> {
    const input = req.body;
    
    // Validate input
    const { errors, isValid } = validateInput(input);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    
    try {
      const result = await this.myService.create(input);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}
```

**2. Create Service**

```typescript
// server/src/service/my-service/my.service.ts
import { injectable } from 'inversify';

export abstract class MyService {
  public abstract getData(): Promise<any[]>;
  public abstract create(data: any): Promise<any>;
}

@injectable()
export class MyServiceImplementation implements MyService {
  public async getData(): Promise<any[]> {
    // Business logic here
    return [];
  }
  
  public async create(data: any): Promise<any> {
    // Business logic here
    return data;
  }
}
```

**3. Register Service**

```typescript
// server/src/service/services-registration.ts
import { Container } from 'inversify';
import { MyService, MyServiceImplementation } from './my-service';

export const CONTAINER = new Container();
CONTAINER.bind(MyService).to(MyServiceImplementation);
```

**4. Import Controller**

```typescript
// server/src/controller/index.ts
import './my.controller';
```

---

### Adding a New React Component

**1. Create Component Directory**

```bash
mkdir frontend/src/components/MyComponent
cd frontend/src/components/MyComponent
```

**2. Create Component Files**

```typescript
// MyComponent.tsx
import * as React from 'react';
import './MyComponent.scss';

export interface MyComponentProps {
  title: string;
  onSave: (data: any) => void;
}

export interface MyComponentState {
  value: string;
}

export class MyComponent extends React.Component<MyComponentProps, MyComponentState> {
  constructor(props: MyComponentProps) {
    super(props);
    this.state = {
      value: ''
    };
  }
  
  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  }
  
  private handleSubmit = () => {
    this.props.onSave(this.state.value);
  }
  
  public render(): JSX.Element {
    return (
      <div className="my-component">
        <h2>{this.props.title}</h2>
        <input 
          type="text" 
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSubmit}>Save</button>
      </div>
    );
  }
}
```

**3. Create Styles**

```scss
// MyComponent.scss
.my-component {
  padding: 20px;
  
  h2 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  input {
    padding: 8px;
    border: 1px solid #ccc;
  }
  
  button {
    margin-left: 8px;
    padding: 8px 16px;
  }
}
```

**4. Export Component**

```typescript
// frontend/src/components/index.ts
export * from './MyComponent/MyComponent';
```

**5. Use Component**

```typescript
import { MyComponent } from 'components';

<MyComponent
  title="My Title"
  onSave={(data) => console.log(data)}
/>
```

---

### Adding Redux State Management

**1. Create Module Directory**

```bash
mkdir -p frontend/src/store/my-module
```

**2. Define Interfaces**

```typescript
// interfaces.ts
export interface MyModuleState {
  data: any[];
  loadStatus: LoadStatus;
  selectedItem?: any;
}
```

**3. Create Actions**

```typescript
// my-module.action.ts
import { action } from '../decorators';

export enum MyModuleTypes {
  GetData = '[my-module] Get Data',
  GetDataSuccess = '[my-module] Get Data Success',
  GetDataError = '[my-module] Get Data Error'
}

@action()
export class GetData {
  public readonly type = MyModuleTypes.GetData;
}

@action()
export class GetDataSuccess {
  public readonly type = MyModuleTypes.GetDataSuccess;
  constructor(public payload: any[]) {}
}

@action()
export class GetDataError {
  public readonly type = MyModuleTypes.GetDataError;
}

export type MyModuleActions = 
  | GetData
  | GetDataSuccess
  | GetDataError;
```

**4. Create Reducer**

```typescript
// my-module.reducer.ts
import { MyModuleState } from './interfaces';
import { MyModuleActions, MyModuleTypes } from './my-module.action';
import { initialMyModuleState } from './my-module.initial';

export const myModuleReducer = (
  state: MyModuleState = initialMyModuleState,
  action: MyModuleActions
): MyModuleState => {
  switch (action.type) {
    case MyModuleTypes.GetData:
      return {
        ...state,
        loadStatus: LoadStatus.Fetching
      };
      
    case MyModuleTypes.GetDataSuccess:
      return {
        ...state,
        data: action.payload,
        loadStatus: LoadStatus.Success
      };
      
    case MyModuleTypes.GetDataError:
      return {
        ...state,
        loadStatus: LoadStatus.Error
      };
      
    default:
      return state;
  }
};
```

**5. Create Effects (Epics)**

```typescript
// my-module.effects.ts
import { Epic } from 'redux-observable';
import { of, from } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';

import { MyModuleActions, MyModuleTypes, GetData, GetDataSuccess, GetDataError } from './my-module.action';
import { HttpWrapper } from 'services';

const getDataEpic: Epic<MyModuleActions, MyModuleActions, AppState> = (action$) =>
  action$.pipe(
    ofType(MyModuleTypes.GetData),
    mergeMap(() =>
      from(HttpWrapper.get<any[]>('api/my-module/data')).pipe(
        map((response) => new GetDataSuccess(response.data)),
        catchError(() => of(new GetDataError()))
      )
    )
  );

export const MyModuleEffects = [getDataEpic];
```

**6. Register in Store**

```typescript
// frontend/src/store/store.config.ts
import { myModuleReducer, MyModuleState, MyModuleEffects } from './my-module';

interface AppState {
  // ... existing modules
  myModule: MyModuleState;
}

const rootReducers = combineReducers({
  // ... existing reducers
  myModule: myModuleReducer
});

const rootEpic = combineEpics(
  // ... existing epics
  ...MyModuleEffects
);
```

---

### Adding a Database Model

**1. Define Interface**

```typescript
// server/Interfaces/MyModel.ts
export interface MyModel {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}
```

**2. Create Sequelize Model**

```typescript
// server/models/myModel.ts
import Sequelize from 'sequelize';
import { db } from './SequelizeConnect';
import { dbConfig } from 'config/dbconfig';

export interface MyModel {
  id: number;
  name: string;
  description: string;
}

export const MyModelDb = db.connect.define(
  'my_model',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    tableName: 'my_model'
  }
);
```

**3. Export Model**

```typescript
// server/models/index.ts
export * from './myModel';
```

---

## Code Examples

### Making an Authenticated API Call

**Frontend:**

```typescript
import axios from 'axios';
import { setAuthToken } from 'utils';

// Set token (usually done after login)
const token = localStorage.getItem('jwtToken');
if (token) {
  setAuthToken(token);
}

// Make authenticated request
const response = await axios.get('http://localhost:3001/api/v1/protected-route');
```

**Backend:**

```typescript
import passport from 'passport';

@httpGet('/protected-route', passport.authenticate('jwt', { session: false }))
public async protectedRoute(req: Request, res: Response): Promise<Response> {
  // User is authenticated, req.user contains user data
  return res.status(200).json({ message: 'Success' });
}
```

---

### Handling Forms with Validation

```typescript
import * as React from 'react';
import { TextField, FormGroup } from '@material-ui/core';
import { CaButton } from 'components';

interface FormState {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
}

class MyForm extends React.Component<{}, FormState> {
  state = {
    email: '',
    password: '',
    emailError: '',
    passwordError: ''
  };
  
  private validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      this.setState({ emailError: 'Invalid email format' });
      return false;
    }
    this.setState({ emailError: '' });
    return true;
  }
  
  private validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      this.setState({ passwordError: 'Password must be at least 6 characters' });
      return false;
    }
    this.setState({ passwordError: '' });
    return true;
  }
  
  private handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = this.validateEmail(this.state.email);
    const isPasswordValid = this.validatePassword(this.state.password);
    
    if (isEmailValid && isPasswordValid) {
      // Submit form
      console.log('Form submitted', this.state);
    }
  }
  
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup>
          <TextField
            label="Email"
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
            error={!!this.state.emailError}
            helperText={this.state.emailError}
          />
        </FormGroup>
        
        <FormGroup>
          <TextField
            label="Password"
            type="password"
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
            error={!!this.state.passwordError}
            helperText={this.state.passwordError}
          />
        </FormGroup>
        
        <CaButton type="submit">Submit</CaButton>
      </form>
    );
  }
}
```

---

### WebSocket Communication

**Frontend:**

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Listen for events
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('game-update', (data) => {
  console.log('Game updated:', data);
});

// Emit events
socket.emit('join-game', { gameId: 1, userId: 123 });

// Disconnect
socket.disconnect();
```

**Backend:**

```typescript
// In service
socketService.notifyAllClients('game-update', JSON.stringify(gameData));
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
- Ensure MySQL is running
- Check database credentials in `server/src/config/dbconfig.ts`
- Verify database exists

```bash
# Start MySQL (Mac)
brew services start mysql

# Start MySQL (Linux)
sudo service mysql start

# Check if MySQL is running
mysql -u root -p
```

---

#### 2. Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port in config
```

---

#### 3. Module Not Found

**Error:** `Cannot find module '@material-ui/core'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

#### 4. TypeScript Compilation Errors

**Solution:**
```bash
# Clean build
rm -rf dist/

# Rebuild
npm run build
```

---

#### 5. CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
Ensure CORS is enabled in server:
```typescript
// server/src/app.ts
import cors from 'cors';
app.use(cors());
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run server tests
cd server && npm test

# Run frontend tests
cd frontend && npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

**Component Test Example:**

```typescript
import { render, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent title="Test" onSave={jest.fn()} />);
    expect(getByText('Test')).toBeInTheDocument();
  });
  
  it('calls onSave when button clicked', () => {
    const onSave = jest.fn();
    const { getByText } = render(<MyComponent title="Test" onSave={onSave} />);
    
    fireEvent.click(getByText('Save'));
    
    expect(onSave).toHaveBeenCalled();
  });
});
```

**Reducer Test Example:**

```typescript
import { myReducer } from './my.reducer';
import { GetData, GetDataSuccess } from './my.action';

describe('myReducer', () => {
  it('should handle GetData', () => {
    const action = new GetData();
    const newState = myReducer(initialState, action);
    
    expect(newState.loadStatus).toBe(LoadStatus.Fetching);
  });
  
  it('should handle GetDataSuccess', () => {
    const data = [{ id: 1, name: 'Test' }];
    const action = new GetDataSuccess(data);
    const newState = myReducer(initialState, action);
    
    expect(newState.data).toEqual(data);
    expect(newState.loadStatus).toBe(LoadStatus.Success);
  });
});
```

---

## Deployment

### Production Build

```bash
# Build entire application
npm run full-build

# Or build separately
cd server && npm run prod
cd frontend && npm run build
```

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.production
NODE_ENV=production
DATABASE_URL=mysql://user:pass@host:port/dbname
JWT_SECRET=your-secret-key
PORT=3001
```

### Deployment Checklist

- [ ] Update database credentials
- [ ] Set environment variables
- [ ] Build production bundles
- [ ] Run database migrations
- [ ] Test all critical paths
- [ ] Set up monitoring/logging
- [ ] Configure reverse proxy (nginx)
- [ ] Enable SSL/TLS
- [ ] Set up backups
- [ ] Document deployment process

---

## Additional Resources

### Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Components Guide](./COMPONENTS_GUIDE.md)
- [Redux Store Guide](./REDUX_STORE_GUIDE.md)

### External Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Redux Documentation](https://redux.js.org/)
- [Material-UI Documentation](https://mui.com/)
- [Express.js Guide](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)

---

## Getting Help

### Before Asking for Help

1. Check the documentation
2. Search existing issues
3. Review error messages carefully
4. Try debugging with console.log/debugger
5. Check browser console for errors
6. Verify all dependencies are installed

### How to Ask for Help

When reporting issues, include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Error messages/stack traces
- Environment details (OS, Node version, etc.)
- What you've tried so far

---

## Code Style Guidelines

### TypeScript

- Use interfaces over types
- Prefer `const` and `let` over `var`
- Use arrow functions for callbacks
- Add type annotations for function parameters
- Use async/await instead of callbacks

### React

- Use functional components with hooks when possible
- Extract complex logic into custom hooks
- Keep components small and focused
- Use meaningful component and prop names
- Add PropTypes or TypeScript interfaces

### CSS/SCSS

- Use BEM naming convention
- Prefix component classes with component name
- Keep specificity low
- Use variables for colors and spacing
- Mobile-first approach

---

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Write/update tests
5. Ensure all tests pass
6. Lint your code
7. Commit your changes
8. Push to your fork
9. Create a pull request

---

## License

This project is proprietary software. All rights reserved.
