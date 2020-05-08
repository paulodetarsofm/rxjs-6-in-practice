import { Observable, Subscriber } from 'rxjs';

export function createHttpObservable<T>(url: string): Observable<T> {
  return new Observable((observer: Subscriber<T>) => {
    fetch(url)
      .then((response: Response) => {
        return response.json() || undefined;
      })
      .then((body: any) => {
        observer.next(body);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
}
