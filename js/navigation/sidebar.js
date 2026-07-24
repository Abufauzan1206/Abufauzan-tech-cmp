import { menuData } from "./menu-data.js";

export function buildSidebar(containerId) {

    const container =
    document.getElementById(
        containerId
    );

    if (!container) return;

    container.innerHTML = "";

    menuData.forEach(menu => {

        if (menu.children) {

            const parent =
            document.createElement("div");

            parent.className =
            "sidebar-parent";

            parent.innerHTML =
            `${menu.icon} ${menu.title}`;

            const subMenu =
            document.createElement("div");

            subMenu.style.display =
            "none";

            menu.children.forEach(
                child => {

                    const link =
                    document.createElement("a");

                    link.href =
                    child.url;

                    link.textContent =
                    child.icon +
                    " " +
                    child.title;

                    link.className =
                    "sidebar-link";

                    subMenu.appendChild(
                        link
                    );

                }
            );

            parent.addEventListener(
                "click",

                () => {

                    subMenu.style.display =

                    subMenu.style.display ===
                    "none"

                    ? "block"

                    : "none";

                }

            );

            container.appendChild(
                parent
            );

            container.appendChild(
                subMenu
            );

        } else {

            const link =
            document.createElement("a");

            link.href =
            menu.url;

            link.textContent =
            menu.icon +
            " " +
            menu.title;

            link.className =
            "sidebar-link";

            container.appendChild(
                link
            );

        }

    });

}