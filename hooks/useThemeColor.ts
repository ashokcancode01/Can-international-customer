import { useTheme, type Theme } from "@/theme/ThemeProvider";

export function useThemeColor(
    colorName: keyof Theme['colors'],
    props?: { light?: string; dark?: string }
) {
    const { theme } = useTheme();

    if (props && props.light && props.dark) {
        return theme.dark ? props.dark : props.light;
    }

    return theme.colors[colorName];
}