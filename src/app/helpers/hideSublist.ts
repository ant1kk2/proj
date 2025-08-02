export function hideSublist(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  const sublist = target.closest(".aside__item")!.children[1] as HTMLElement;
  sublist.style.maxHeight = sublist.scrollHeight + "px";
  if (target.innerText === "+") {
    target.innerText = "-";
    setTimeout(() => {
      sublist.classList.remove("hidden");
    },2000)
    sublist.style.maxHeight = sublist.scrollHeight + "px";
  } else {
    target.innerText = "+";
    sublist.classList.add("hidden");
    sublist.style.maxHeight = "0";
  }
}
