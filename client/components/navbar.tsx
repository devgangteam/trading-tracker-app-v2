import { useState } from 'react';
import { createStyles, Header, Group, Container, Burger, Title, Paper, Transition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import ColorToggle from './colorToggle';
import { useRouter } from 'next/router';
import { useUser, UserContext } from '@auth0/nextjs-auth0';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,

        [theme.fn.smallerThan('sm')]: {
            justifyContent: 'flex-start',
        },
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    links: {
        width: 260,

        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    social: {
        width: 260,

        [theme.fn.smallerThan('sm')]: {
            width: 'auto',
            marginLeft: 'auto',
        },
    },

    burger: {
        marginRight: theme.spacing.md,

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));

interface HeaderMiddleProps {
    links: { link: string; label: string }[];
}

export function HeaderMiddle({ links }: HeaderMiddleProps) {
    const { user, error, isLoading }: UserContext = useUser();
    const router = useRouter();
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(router.pathname.replace('/', ''));
    const { classes, cx } = useStyles();

    const items = links.map((link) => (
        <Link href={link.link} key={link.label}>
            <a onClick={() => { setActive(link.link); toggle(); }} className={cx(classes.link, { [classes.linkActive]: active === link.link })}>
                {link.label}
            </a>
        </Link>
    ));

    return (
        <Header height={56} mb={30}>
            <Container className={classes.inner}>
                <Burger opened={opened} onClick={toggle} size="sm" className={classes.burger} />

                <Group className={classes.links} spacing={5}>
                    {items}
                </Group>

                <Title order={2}>Trading Tracker</Title>

                <Group spacing={0} className={classes.social} position="right" noWrap>
                    <ColorToggle />
                </Group>

                <Transition transition="pop-top-left" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} withBorder style={styles}>
                            {items}
                        </Paper>
                    )}
                </Transition>

                {
                    user ? (
                        <div>
                            <img src={user.picture || ''} alt={user.name || ''} />
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                            <p>{user.sub}</p>
                        </div>
                    ) : <a href="/api/auth/login">Login</a>
                }
            </Container>
        </Header>
    );
}