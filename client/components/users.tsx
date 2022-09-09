import { Button, Collapse, Title } from "@mantine/core"
import { useEffect, useState } from "react"
import { IconUsers } from '@tabler/icons';
import axios from 'axios';

type UserSectionProps = {

}

export default function UserSection({ }: UserSectionProps) {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        axios.get('/api/serverHealth')
            .then((res) => console.log(res.data));

        axios.get('/api/serverHealth/public')
            .then((res) => console.log(res.data));
    }, [])
    return (
        <>
            <Button onClick={() => setExpanded((expanded) => !expanded)} variant="subtle">
                <IconUsers />
                <Title ml="sm" order={4}>Users</Title>
            </Button>

            <Collapse in={expanded}>
                DATA
            </Collapse>
        </>)
}