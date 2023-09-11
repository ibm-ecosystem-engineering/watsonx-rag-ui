
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
    TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch, Button
} from "@carbon/react";

import './DataTable.scss';

export interface DataTableProps<ColType extends any[]> {
    headerData: DataTableHeader[];
    rowData: Array<Omit<DataTableRow<ColType>, 'cells'>>;
    onRowClick?: (id: string) => void;
    onToolbarButtonClick?: () => void;
    toolbarButtonText?: string;
}

export const DataTable: React.FunctionComponent<DataTableProps<any[]>> = <ColType extends any[],> (props: DataTableProps<ColType>) => {

    const ToolbarButton = ({text, onClick}: {text?: string, onClick?: () => void}) => {
        if (!onClick) {
            return (<></>)
        }

        return (<Button onClick={onClick}>{text || 'New'}</Button>)
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mapHeaderProps = (...props: unknown[]): unknown[] => {
        return props;
    }

    const onRowClick = props.onRowClick || (() => {return});
    return (
        <InnerDataTable rows={props.rowData} headers={props.headerData} isSortable>
            {({ rows, headers, getHeaderProps, getTableProps, getToolbarProps, onInputChange }) => (
                <TableContainer>
                    <TableToolbar {...getToolbarProps()} aria-label="data table toolbar" size="lg">
                        <TableToolbarContent>
                            <TableToolbarSearch onChange={onInputChange} persistent />
                            <ToolbarButton text={props.toolbarButtonText} onClick={props.onToolbarButtonClick} />
                        </TableToolbarContent>
                    </TableToolbar>
                    <Table {...getTableProps()} useZebraStyles size='md'>
                        <TableHead>
                            <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...mapHeaderProps(getHeaderProps({ header }))}>
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
