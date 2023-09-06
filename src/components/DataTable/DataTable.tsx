
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {
    DataTable as InnerDataTable,
    DataTableRow,
    DataTableHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow
} from "@carbon/react";

import './DataTable.scss';

export interface DataTableProps<ColType extends any[]> {
    headerData: DataTableHeader[];
    rowData: Array<Omit<DataTableRow<ColType>, 'cells'>>;
    onRowClick?: (id: string) => void;
}

export const DataTable: React.FunctionComponent<DataTableProps<any[]>> = <ColType extends any[],> (props: DataTableProps<ColType>) => {

    const onRowClick = props.onRowClick || (() => {return});
    return (
        <InnerDataTable rows={props.rowData} headers={props.headerData} isSortable>
            {({ rows, headers, getHeaderProps, getTableProps }) => (
                <TableContainer>
                    <Table {...getTableProps()} useZebraStyles size='md'>
                        <TableHead>
                            <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>
                                        {header.header}
                                    </TableHeader>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id} onClick={() => onRowClick(row.id)}>
                                    {row.cells.map((cell) => (
                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </InnerDataTable>
    )
}
