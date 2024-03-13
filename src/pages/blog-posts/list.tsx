import React from "react";
import {
  IResourceComponentsProps,
  useNavigation,
} from "@refinedev/core";

import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { LucideEdit, LucideEye } from "lucide-react";

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
        accessorKey: "category.title",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "Actions",
        cell: function render({ getValue }) {
          return (
            <div
                className="flex flex-row flex-nowrap gap-0"
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        show("blog_posts", getValue() as string);
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
                        edit("blog_posts", getValue() as string);
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

  const tableProps = useTable({
      columns,
      refineCoreProps: {
        meta: {
          populate: ["category"],
        },
      },
  });

  return (
      <div className="p-2">
          <div
              className="flex justify-between items-center my-2 mx-2"
          >
              <h1
                  className="scroll-m-20 text-2xl font-extrabold tracking-tight"
              >
                  Blog Posts
              </h1>
              <div className="p-2">
                  <Button onClick={() => create("blog_posts")}>Create</Button>
              </div>
          </div>
          <DataTable {...tableProps} />
      </div>
  );
};
