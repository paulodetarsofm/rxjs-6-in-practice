import { Observable, Subscriber } from 'rxjs';

export function createHttpObservable(url: string): Observable<any> {
  return new Observable((observer: Subscriber<any>) => {

    // Allows the cancellation of the fetch request
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal })
      .then((response: Response) => {
        return response.json();
      })
      .then((body: any) => {
        observer.next(body);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });

    return () => controller.abort();
  });
}
