export class ErrorBoundary {
  static handle(error: Error, context: string) {
    console.error(`Error in ${context}:`, error);
    
    // Log to analytics service if needed
    // analyticsService.logError(error);

    // Show user-friendly error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
      <p>Sorry, something went wrong. Please try refreshing the page.</p>
      <button onclick="window.location.reload()">Refresh Page</button>
    `;

    return errorElement;
  }

  static wrapPromise<T>(promise: Promise<T>, context: string): Promise<T> {
    return promise.catch(error => {
      throw this.handle(error, context);
    });
  }
}
