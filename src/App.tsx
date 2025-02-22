import Alert from './components/atoms/alert/Alert';
import ErrorBoundary from './components/molecules/error-boundary/ErrorBoundary';
import TodoApp from './components/organisms/todo-app/TodoApp';
import useError from './hooks/useError';

function App() {
  const { error, setError, clearError } = useError();

  const TestComponent = () => {
    const handleErrorClick = () => {
      throw new Error('Manually triggered error');
    };

    return (
      <button className="btn btn-danger" onClick={handleErrorClick}>
        Trigger Error
      </button>
    );
  };

  return (
    <ErrorBoundary>
      <div
        className="position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1050 }}
      >
        {error.show && (
          <Alert
            message={error.message}
            variant={error.variant}
            show={error.show}
            onClose={clearError}
            timeout={error.timeout}
          />
        )}
      </div>
      <TestComponent />
      <TodoApp onError={setError} />
    </ErrorBoundary>
  );
}

export default App;
