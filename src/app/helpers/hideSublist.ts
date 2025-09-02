export function hideSublist(e: MouseEvent): void {
  const target = e.currentTarget as HTMLElement; // именно кнопка
  const asideItem = target.closest(".aside__item");
  if (!asideItem) return;

  const sublist = asideItem.querySelector(".aside__list") as HTMLElement;
  if (!sublist) return;

  const isOpen = sublist.style.maxHeight && sublist.style.maxHeight !== "0px";

  if (isOpen) {
    sublist.style.maxHeight = sublist.scrollHeight + "px"; // фикс для корректной анимации
    requestAnimationFrame(() => {
      sublist.style.maxHeight = "0";
    });
    target.innerText = "+";
  } else {
    sublist.style.maxHeight = sublist.scrollHeight + "px";
    target.innerText = "-";

    sublist.addEventListener(
      "transitionend",
      () => {
        if (sublist.style.maxHeight !== "0px") {
          sublist.style.maxHeight = "none"; // снимаем ограничение после раскрытия
        }
      },
      { once: true }
    );
  }
}
