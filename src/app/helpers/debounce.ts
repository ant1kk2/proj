export function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer); // отменяем предыдущий запуск
    timer = setTimeout(() => {
      func.apply(this, args); // вызываем только последний
    }, delay);
  };
}

