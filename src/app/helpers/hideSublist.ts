export function hideSublist(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  const asideItem = target.closest(".aside__item");
  if (!asideItem) return;
  const sublist = asideItem.querySelector(".aside__list");
  if (!sublist) return;

  if ((sublist as HTMLElement).style.maxHeight && (sublist as HTMLElement).style.maxHeight !== "0px") {
    (sublist as HTMLElement).style.maxHeight = "0";
    target.innerText = "+";
  } else {
    (sublist as HTMLElement).style.maxHeight = sublist.scrollHeight + "px";
    target.innerText = "-";
    sublist.addEventListener("transitionend", () => {
        if ((sublist as HTMLElement).style.maxHeight !== "0px") (sublist as HTMLElement).style.maxHeight = "none";
      },
      {once: true}
    );
  }
}
