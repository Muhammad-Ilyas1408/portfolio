/** "tel:+923154710472" → "+92 315 4710472"; other numbers are shown as is. */
export function formatPhone(href: string) {
  const number = href.replace(/^tel:/, "");
  return number.replace(/^\+92(\d{3})(\d{7})$/, "+92 $1 $2");
}
