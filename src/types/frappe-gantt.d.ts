declare module "frappe-gantt/dist/frappe-gantt.css";

declare module "frappe-gantt" {
  interface GanttTask {
    id: string;
    name: string;
    start: string;
    end: string;
    progress: number;
    dependencies?: string;
    custom_class?: string;
    color?: string;
  }

  interface GanttOptions {
    view_mode?: string;
    language?: string;
    popup?: boolean | ((ctx: unknown) => void);
    popup_on?: string;
    readonly?: boolean;
    readonly_dates?: boolean;
    readonly_progress?: boolean;
    today_button?: boolean;
    bar_height?: number;
    bar_corner_radius?: number;
    column_width?: number;
    container_height?: string | number;
    padding?: number;
    infinite_padding?: boolean;
    on_click?: (task: GanttTask) => void;
    on_date_change?: (task: GanttTask, start: Date, end: Date) => void;
    on_progress_change?: (task: GanttTask, progress: number) => void;
    on_view_change?: (mode: string) => void;
    scroll_to?: string | Date;
  }

  class Gantt {
    constructor(
      element: string | HTMLElement | SVGElement,
      tasks: GanttTask[],
      options?: GanttOptions
    );
    change_view_mode(mode: string): void;
    scroll_current(): void;
  }

  export default Gantt;
}
