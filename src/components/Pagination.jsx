"use client";

import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

export default function Pagination({ pagination, onPageChange, lang }) {
    const t = useTranslations("pagination");

    if (!pagination || !pagination.links) return null;

    const { links, from, to, total } = pagination;

    const prevLink = links.find((l) => l.label.toLowerCase().includes("previous"));
    const nextLink = links.find((l) => l.label.toLowerCase().includes("next"));

    return (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 dark:bg-[#303030]">
            {/* 📱 Mobile View */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    disabled={!prevLink?.url}
                    onClick={() =>
                        onPageChange &&
                        prevLink?.url &&
                        onPageChange(getPageNumber(prevLink.url))
                    }
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                    {t("previous")}
                </button>

                <button
                    disabled={!nextLink?.url}
                    onClick={() =>
                        onPageChange &&
                        nextLink?.url &&
                        onPageChange(getPageNumber(nextLink.url))
                    }
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                    {t("next")}
                </button>
            </div>

            {/* 💻 Desktop View */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span>{t("Showing")}</span> {from} <span>{t("to")}</span> {to} <span>{t("of")}</span> {total} <span>{t("results")}</span>
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
                            const isPrev = label.toLowerCase().includes("previous");
                            const isNext = label.toLowerCase().includes("next");
                            const page = getPageNumber(link.url);

                            return (
                                <button
                                    key={i}
                                    disabled={isDisabled}
                                    onClick={() => !isDisabled && onPageChange && onPageChange(page)}
                                    className={`relative inline-flex items-center px-2 py-2 text-sm font-semibold ring-1 ring-inset
                                        ${
                                            isPrev
                                                ? lang === "ar"
                                                    ? "rounded-r-md"
                                                    : "rounded-l-md"
                                                : isNext
                                                ? lang === "ar"
                                                    ? "rounded-l-md"
                                                    : "rounded-r-md"
                                                : ""
                                        }
                                        ${
                                            isActive
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
                                        <span dangerouslySetInnerHTML={{ __html: label }} />
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

// 📌 Extracts ?page= from URL
function getPageNumber(url) {
    if (!url) return null;
    try {
        const u = new URL(url);
        return u.searchParams.get("page");
    } catch {
        return null;
    }
}
