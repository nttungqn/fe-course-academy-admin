import "./UserList.css";
import { DataGrid } from "@material-ui/data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ButtonCreate } from './../../components/ButtonCreate/ButtonCreate'
import { axiosInstance } from "../../utils/axios";

const useStyles = makeStyles({

    dataGrid: {
        width: "100%"
    },
});

export default function UserList() {
    const classes = useStyles();
    const [data, setData] = useState([]);

    useEffect(function () {
        async function loadNewMembers() {
            const res = await axiosInstance.get('/users?limit=999&sort_type=asc');
            if (res.data.users) {
                let users = res.data.users.map((el) => {
                    el['user']['role'] = el['role'];
                    delete el['role'];
                    return el['user'];
                });
                console.log(users);
                setData(users);
            }
        }

        loadNewMembers();
    }, []);

    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.15 },
        {
            field: "user",
            headerName: "User",
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <div className="userListUser">
                        <img className="userListImg" src={params.row.avatar} alt="" />
                        {params.row.fullname}
                    </div>
                );
            },
        },
        { field: "email", headerName: "Email", width: 200 },
        {
            field: "role",
            headerName: "Role",
            flex: 0.15,
            renderCell: (params) => {
                return (
                    <div>{params.row.role.name}</div>
                );
            }
        },
        {
            field: "address",
            headerName: "Address",
            flex: 0.5,
        },
        {
            field: "action",
            headerName: "Action",
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={"/user/" + params.row.id}>
                            <button className="buttonEdit">Edit</button>
                        </Link>
                        <button className="buttonDelete" variant="contained"
                            onClick={() => handleDelete(params.row.id)}>Delete
                        </button>
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
            <h1>User List</h1>
            <ButtonCreate link="/user/create-new-user" name="Create new user"></ButtonCreate>
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