import { Observable, Subscriber } from 'rxjs';

export function createHttpObservable(url: string): Observable<any> {
  return new Observable((observer: Subscriber<any>) => {
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
