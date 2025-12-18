import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

interface ToastOptions {
  duration?: number;
  position?: "top" | "bottom";
  visibilityTime?: number;
  autoHide?: boolean;
  onShow?: () => void;
  onHide?: () => void;
}

/**
 * Toast manager utility to display consistent toast notifications
 */
class ToastManager {
  private defaultOptions: ToastOptions = {
    visibilityTime: 4000,
    autoHide: true,
    position: "top",
  };

  /**
   * Show a toast notification
   * @param type The type of toast (success, error, info)
   * @param title The toast title
   * @param message The toast message
   * @param options Additional toast options
   */
  private show(
    type: ToastType,
    title: string,
    message: string,
    options?: ToastOptions
  ): void {
    Toast.show({
      type,
      text1: title,
      text2: message,
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * Show a success toast
   * @param title The toast title
   * @param message The toast message
   * @param options Additional toast options
   */
  public success(title: string, message: string, options?: ToastOptions): void {
    this.show("success", title, message, options);
  }

  /**
   * Show an error toast
   * @param title The toast title
   * @param message The toast message
   * @param options Additional toast options
   */
  public error(title: string, message: string, options?: ToastOptions): void {
    this.show("error", title, message, options);
  }

  /**
   * Show an info toast
   * @param title The toast title
   * @param message The toast message
   * @param options Additional toast options
   */
  public info(title: string, message: string, options?: ToastOptions): void {
    this.show("info", title, message, options);
  }
}

export const toastManager = new ToastManager();
