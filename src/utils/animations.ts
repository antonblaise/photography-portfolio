export const fadeInAnimation = (
    hasMounted: boolean,
    delay: string = "delay-0"
): string => {
    return `duration-500 ${delay} ease-out transition-all ${hasMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`
}