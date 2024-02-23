import React from "react";

import {
  GetManyResponse,
  IResourceComponentsProps,
  useMany,
  useNavigation,
} from "@refinedev/core";

import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";

import { 
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronLeftIcon,
  ChevronRightIcon,
  LucideEdit,
  LucideEye
} from "lucide-react";

import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

export const BlogPostList: React.FC<IResourceComponentsProps> = () => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
      },
      {
        id: "content",
        accessorKey: "content",
        header: "Content",
      },
      {
        id: "category",
        header: "Category",
        accessorKey: "category",
        cell: function render({ getValue, table }) {
          const meta = table.options.meta as {
            categoryData: GetManyResponse;
          };

          try {
            const category = meta.categoryData?.data?.find(
              (item) => item.id == getValue<any>()?.id
            );

            return category?.title ?? "Loading...";
          } catch (error) {
            return null;
          }
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created At",
        cell: function render({ getValue }) {
          return new Date(getValue<any>()).toLocaleString(undefined, {
            timeZone: "UTC",
          });
        },
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "Actions",
        cell: function render({ getValue }) {
          return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    gap: "1px",
                }}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        show("posts", getValue() as string);
                    }}
                >
                    <LucideEye
                        size={16}
                    />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        edit("posts", getValue() as string);
                    }}
                >
                    <LucideEdit
                        size={16}
                    />
                </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const { edit, show, create } = useNavigation();

  const {
    getHeaderGroups,
    getRowModel,
    setOptions,
    refineCore: {
      tableQueryResult: { data: tableData },
    },
    getState,
    setPageIndex,
    getCanPreviousPage,
    getPageCount,
    getCanNextPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable({
    columns,
  });

  const { data: categoryData } = useMany({
    resource: "categories",
    ids:
      tableData?.data?.map((item) => item?.category?.id).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableData?.data,
    },
  });

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
      categoryData,
    },
  }));

  return (
    <div style={{ padding: "16px" }}>
            <div
                className="flex justify-between items-center my-8 mx-2"
            >
                <h1
                    className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                >
                    Posts
                </h1>
                <div className="p-2">
                    <Button onClick={() => create("posts")}>Create</Button>
                </div>
            </div>
            <div style={{ maxWidth: "100%", overflowY: "scroll" }}>
                <Table>
                    <TableHeader>
                        {getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {!header.isPlaceholder &&
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem
                    >
                        <PaginationLink
                            onClick={() => setPageIndex(0)}
                        >   
                            <ArrowLeftToLine className="h-4 w-4" />
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => previousPage()}
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </PaginationPrevious>

                    </PaginationItem>
                    <PaginationItem
                    
                    >
                        <PaginationNext
                            onClick={() => nextPage()}
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </PaginationNext>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => setPageIndex(getPageCount() - 1)}
                        >
                            <ArrowRightToLine className="h-4 w-4" />
                        </PaginationLink>
                    </PaginationItem>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                            Page {getState().pagination.pageIndex + 1} of{" "}
                            {getPageCount()}
                        </div>
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${getState().pagination.pageSize}`}
                                onValueChange={(value: any) => {
                                setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </PaginationContent>
            </Pagination>
        </div>
  );
};
