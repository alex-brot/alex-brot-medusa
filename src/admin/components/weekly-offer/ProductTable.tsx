import {
    createDataTableColumnHelper,
    DataTable, DataTablePaginationState,
    Heading,
    useDataTable
} from "@medusajs/ui";
import {useMemo, useState} from "react";

const columnHelper = createDataTableColumnHelper<TableProduct>();

const useCommands = () => {
    return [];
};
export function ProductTable({
                                 data,
                                 setSelectedProductIds,
                                 pageSize,
                                 columns,
                             }: {
    data: TableProduct[],
    setSelectedProductIds?: React.Dispatch<React.SetStateAction<string[]>>,
    pageSize?: number,
    columns?: {
        quantity: boolean,
    },
}) {
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [search, setSearch] = useState("")
    const [pagination, setPagination] = useState<DataTablePaginationState>({
        pageSize: pageSize?? 15,
        pageIndex: 0
    })

    const shownProducts = useMemo(() => {
        return data.filter((product) => product.title.toLowerCase().includes(search.toLowerCase()))
            .slice(
                pagination.pageIndex * pagination.pageSize,
                setSelectedProductIds? (pagination.pageIndex + 1) * pagination.pageSize : data.length
            )
    }, [search, pagination])

    const commands = useCommands();

    const instance = useDataTable({
        data: shownProducts,
        columns: [
            ...(setSelectedProductIds ? [columnHelper.select()] : []),
            columnHelper.accessor("title", {
                header: "Title",
                enableSorting: true,
            }),
            columnHelper.accessor("thumbnail", {
                header: "Thumbnail",
                cell: (info) => <img src={info.getValue()} alt="Thumbnail" className="w-10 h-10" />, // Display image
            }),
            ...(columns?.quantity ? [
                columnHelper.accessor("quantity", {
                    header: "Quantity",
                    enableSorting: true
                }),
            ] : []),
        ],
        getRowId: (product) => product.id.toString(),
        rowCount: data.length,
        isLoading: false,
        commands,
        rowSelection: setSelectedProductIds
            ? {
                state: rowSelection,
                onRowSelectionChange: (newSelection) => {
                    setRowSelection(newSelection);
                    const selectedIds = Object.keys(newSelection).filter(id => newSelection[id]); // Extract selected IDs
                    setSelectedProductIds?.(selectedIds);
                },
            }
            : undefined,
        search: {
            state: search,
            onSearchChange: setSearch
        },
        pagination: {
            state: pagination,
            onPaginationChange: setPagination,
        },
    });

    return (
        <DataTable instance={instance}>
            <DataTable.Toolbar className="flex justify-between items-center">
                <Heading>Products</Heading>
                { setSelectedProductIds && <DataTable.Search placeholder="Search..." />}
            </DataTable.Toolbar>
            <DataTable.Table />
            {setSelectedProductIds && <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />}
            {setSelectedProductIds && <DataTable.Pagination />}
        </DataTable>
    );
}

export interface TableProduct{
    id: string,
    title: string,
    thumbnail: string,
    quantity?: number,
}