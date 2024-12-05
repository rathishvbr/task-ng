## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rathishvbr/task-ng
```

2. Install dependencies:
```bash
npm install
```

3. Start the application with mock API server at the same time (installed concurrently as a devDependencies):
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:4200
```

## Testing

The application includes comprehensive test coverage (79 test cases):

```bash
# Run all tests
ng test

# Run tests with coverage report
ng test --code-coverage
```

## API Endpoints

The mock API (JSON Server) provides the following endpoints:

- `GET /employees` - Fetch all employees
- `GET /employees/:id` - Fetch single employee
- `POST /employees` - Create new employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

## Original Requirements Met

✅ Employee List View with filtering
✅ Employee Details with edit capability
✅ Employee create & delete functionality
✅ NgRx State Management
✅ RxJS Implementation - actions, reducers, selectors and effects
✅ Unit tests using Jasmine and Karma (79 test cases)
✅ Optional feature: Local storage to persist state for filters, sorting & pagination value
✅ SCSS Styling
✅ Material UI Integration
✅ Clean Code Structure
✅ Type Safety
✅ Error Handling

Thanks you !!
