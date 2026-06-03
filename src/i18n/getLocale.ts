export function getLocale() {
  const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale ?? "en";
  const locale = systemLocale.split("-").at(0) ?? "en";
  return locale;
}
