"use client";

import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

export default function Pagination({ pagination, onPageChange, lang }) {
    const t = useTranslations("pagination");

    if (!pagination || !pagination.links) return null;

    const { links, from, to, total } = pagination;

    return (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 dark:bg-[#303030]">
            {/* للموبايل */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    disabled={!pagination.prev_page_url}
                    onClick={() =>
                        onPageChange &&
                        pagination.prev_page_url &&
                        onPageChange(getPageNumber(pagination.prev_page_url))
                    }
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                    {t("previous")}
                </button>
                <button
                    disabled={!pagination.next_page_url}
                    onClick={() =>
                        onPageChange &&
                        pagination.next_page_url &&
                        onPageChange(getPageNumber(pagination.next_page_url))
                    }
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                    {t("next")}
                </button>
            </div>

            {/* للديسكتوب */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span>{t("Showing")}</span> { from } <span>{t("to")}</span>  <span>{ to }</span>  <span>{t('of')}</span> { total } <span>{t('results')}</span>
                    </p>
                </div>
                <div>
                    <nav
                        aria-label="Pagination"
                        className="isolate inline-flex -space-x-px rounded-md shadow-xs"
                    >
                        {links.map((link, i) => {
                            const isDisabled = !link.url;
                            const isActive = link.active;
                            const label = link.label;

                            const isPrev = label.includes("Previous");
                            const isNext = label.includes("Next");

                            const page = getPageNumber(link.url);

                            return (
                                <button
                                    key={i}
                                    disabled={isDisabled}
                                    onClick={() => !isDisabled && onPageChange && onPageChange(page)}
                                    className={`relative inline-flex items-center px-2 py-2 text-sm font-semibold ring-1 ring-inset
    ${isPrev
                                            ? lang === "ar"
                                                ? "rounded-r-md"
                                                : "rounded-l-md"
                                            : isNext
                                                ? lang === "ar"
                                                    ? "rounded-l-md"
                                                    : "rounded-r-md"
                                                : ""
                                        }
    ${isActive
                                            ? "z-10 bg-main-color text-white"
                                            : "text-gray-900 dark:text-gray-200 ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        }
    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
  `}
                                >
                                    {isPrev ? (
                                        <>
                                            <span className="sr-only">{t("previous")}</span>
                                            <FontAwesomeIcon
                                                icon={lang === "ar" ? faAngleRight : faAngleLeft}
                                                className="w-4 h-4"
                                            />
                                        </>
                                    ) : isNext ? (
                                        <>
                                            <span className="sr-only">{t("next")}</span>
                                            <FontAwesomeIcon
                                                icon={lang === "ar" ? faAngleLeft : faAngleRight}
                                                className="w-4 h-4"
                                            />
                                        </>
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}

// Helper to extract ?page= number
function getPageNumber(url) {
    if (!url) return null;
    try {
        const u = new URL(url);
        return u.searchParams.get("page");
    } catch {
        return null;
    }
}
