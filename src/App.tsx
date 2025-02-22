import Alert from './components/atoms/alert/Alert';
import ErrorBoundary from './components/molecules/error-boundary/ErrorBoundary';
import TodoApp from './components/organisms/todo-app/TodoApp';
import useError from './hooks/useError';

function App() {
  const { error, clearError } = useError();

  return (
    <ErrorBoundary>
      <TodoApp />
      {error.show && (
        <Alert
          message={error.message}
          variant={error.variant}
          show={error.show}
          onClose={clearError}
          timeout={error.timeout}
        />
      )}
    </ErrorBoundary>
  );
}

export default App;
