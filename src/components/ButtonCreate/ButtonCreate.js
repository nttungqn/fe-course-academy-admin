import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #299029 30%, #299029 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        marginBottom: '20px'
    },
    label: {
        textTransform: 'capitalize',
    },
});

export function ButtonCreate({ link, name }) {
    const classes = useStyles();

    return (
        <Button href={link}
            classes={{
                root: classes.root, // class name, e.g. `classes-nesting-root-x`
                label: classes.label, // class name, e.g. `classes-nesting-label-x`
            }}
        >
            {name}
        </Button >
    )
}
