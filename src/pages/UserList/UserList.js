import "./UserList.css";
import { DataGrid } from "@material-ui/data-grid";
import { userRows } from "../../dummy_data";
import { Link } from "react-router-dom";
import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({

    dataGrid: {
        width: "100%"
    }
});

export default function UserList() {
    const classes = useStyles();
    const [data, setData] = useState(userRows);

    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.15 },
        {
            field: "user",
            headerName: "User",
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <div className="userListUser">
                        <img className="userListImg" src={params.row.avatar} alt="" />
                        {params.row.username}
                    </div>
                );
            },
        },
        { field: "email", headerName: "Email", width: 200 },
        {
            field: "status",
            headerName: "Status",
            flex: 0.2,
        },
        {
            field: "transaction",
            headerName: "Transaction Volume",
            flex: 0.2,
        },
        {
            field: "action",
            headerName: "Action",
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={"/user/" + params.row.id}>
                            <button className="buttonEdit">Edit</button>
                        </Link>
                        <button className="buttonDelete" variant="contained"

                            onClick={() => handleDelete(params.row.id)}>Delete</button>
                        {/* <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDelete(params.row.id)}
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button> */}
                        {/* <DeleteOutline
                            className="userListDelete"
                            onClick={() => handleDelete(params.row.id)}
                        /> */}
                    </>
                );
            },
        },
    ];

    return (
        <div className="userList">
            <DataGrid className={classes.dataGrid}
                rows={data}
                disableSelectionOnClick
                columns={columns}
                pageSize={8}
                checkboxSelection
                autoHeight={true}
            />
        </div>
    );
}