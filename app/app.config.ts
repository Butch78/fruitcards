export default defineAppConfig({
  theme: {
    radius: 0.25,
    blackAsPrimary: false,
  },
  ui: {
    colors: {
      primary: "indigo",
      neutral: "zinc",
    },
    dashboardGroup: {
      base: "bg-default",
    },
    dashboardSidebar: {
      slots: {
        root: "border-none",
        footer: "border-none",
      },
    },
    dashboardPanel: {
      slots: {
        root: "bg-muted dark:bg-muted/40 rounded-xl m-4 border border-default",
      },
    },
    navigationMenu: {
      slots: {
        root: "gap-0",
        list: "mb-4",
        label: "text-xs text-muted font-bold",
        linkLeadingIcon: "mr-2",
        separator: "hidden",
        linkLabel:
          "first-of-type:uppercase first-of-type:text-dimmed/80 first-of-type:text-xs",
      },
      variants: {
        active: {
          true: {
            linkLabel: "text-default",
          },
          false: {
            linkLeadingIcon: "text-dimmed",
          },
        },
      },
      compoundVariants: [
        {
          orientation: "vertical",
          collapsed: true,
          class: {
            link: "my-1",
          },
        },
        {
          orientation: "horizontal",
          highlight: true,
          class: {
            link: ["after:h-[2px]"],
          },
        },
      ],
    },
    badge: {
      defaultVariants: {
        variant: "subtle",
      },
    },
    select: {
      defaultVariants: {
        variant: "subtle",
      },
      slots: {
        content: "bg-elevated ring ring-accented",
        itemLeadingIcon: "mr-2",
      },
      variants: {
        variant: {
          subtle: "bg-elevated/40",
        },
      },
    },
    formField: {
      slots: {
        label: "whitespace-nowrap ",
      },
    },
    input: {
      slots: {
        leadingIcon: "!size-4",
        root: "w-full",
      },
      defaultVariants: {
        variant: "subtle",
      },
    },
    dropdownMenu: {
      slots: {
        content: "bg-muted ring ring-accented",
        itemLeadingIcon: "mr-2",
      },
    },
    table: {
      slots: {
        root: "relative overflow-auto ring ring-inset ring-default rounded-lg",
        base: "min-w-full overflow-clip",
        tbody: "divide-y divide-default",
        tr: "divide-x divide-default",
        td: "text-sm py-1.5 px-4",
        th: "bg-elevated/40 py-1.5 px-2 font-normal text-muted",
        separator: "bg-border",
      },
    },
    avatarGroup: {
      slots: {
        base: "ring-default",
      },
    },
    pagination: {
      slots: {
        first: "!hidden",
        prev: "!bg-transparent !ring-0",
        next: "!bg-transparent !ring-0",
        last: "!hidden",
      },
    },
    card: {
      slots: {
        root: "overflow-visible",
        header: "rounded-tl-lg rounded-tr-lg",
      },
      defaultVariants: {
        variant: "subtle",
      },
      variants: {
        variant: {
          outline: {
            root: "bg-transparent ring ring-default divide-y divide-default",
          },
          subtle: {
            root: "bg-muted dark:bg-elevated/20",
            header: "bg-muted dark:bg-transparent",
          },
        },
      },
    },
    button: {
      slots: {
        // leadingIcon: "text-dimmed",
        // trailingIcon: "text-dimmed",
      },
      defaultVariants: {
        color: "neutral",
        variant: "subtle",
      },
      compoundVariants: [
        {
          color: "neutral",
          variant: "outline",
          class:
            "ring ring-inset ring-accented text-muted bg-transparent hover:text-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted",
        },
        {
          color: "neutral",
          variant: "ghost",
          class:
            "text-muted",
        },
          {
          color: 'neutral',
          variant: 'subtle',
          class: 'bg-elevated/40 hover:bg-elevated'
        },
        {
          color: "neutral",
          variant: "soft",
          class:
            "",
        },
      ],
    },
    tabs: {
      variants: {
        variant: {
          pill: {
            list: "ring ring-inset ring-default",
          },
          link: {},
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "pill",
          class: {
            list: "gap-2 bg-transparent",
            trigger: "dark:data-[state=active]:text-primary",
            indicator: "dark:bg-elevated/60",
          },
        },
        {
          color: "neutral",
          variant: "pill",
          class: {
            list: "gap-2 bg-transparent",
            trigger: "dark:data-[state=active]:text-neutral",
            indicator: "dark:bg-elevated/60",
          },
        },
      ],
    },
  },
});
