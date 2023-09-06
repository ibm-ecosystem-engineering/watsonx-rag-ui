
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {ListItem, UnorderedList} from "@carbon/react";
import {dayjs} from 'dayjs';

export interface Comment {
    id: string;
    comment: string;
    timestamp?: string;
    author?: string;
}

export interface CommentListProps {
    comments?: Comment[];
}

export const CommentList: React.FunctionComponent<CommentListProps> = (props: CommentListProps) => {
    if (!props.comments || props.comments.length === 0) {
        return (<></>)
    }

    const commentAttrib = (comment: Comment) => {

        const author = comment.author || 'anonymous';

        const dateString = comment.timestamp ? dayjs(comment.timestamp).format('MM/DD/YYYY') : '';

        return (
            <>({author}&nbsp;{dateString})</>
        )
    }

    return (
        <UnorderedList>
            {props.comments.map(comment => <ListItem key={comment.id}>{comment.comment} {commentAttrib(comment)}</ListItem>)}
        </UnorderedList>
    )
}
