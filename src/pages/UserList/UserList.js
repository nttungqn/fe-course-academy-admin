import "./UserList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from "../../utils/axios";

import EditUser from './../EditUser/EditUser';
import NewUser from './../NewUser/NewUser';
import { Button } from "@material-ui/core";
import { withSnackbar } from "notistack";

const useStyles = makeStyles({

    dataGrid: {
        width: "100%",
        marginTop: '30px'
    },
});

function UserList(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);

    useEffect(function () {
        async function loadNewMembers() {
            const res = await axiosInstance.get('/users?is_delete=false&limit=999&sort_type=asc');
            if (res.data.users) {
                let users = res.data.users.map((el) => {
                    el['user']['role'] = el['role'];
                    delete el['role'];
                    return el['user'];
                });
                setData(users);
            }
        }

        loadNewMembers();
    }, []);

    const handleDelete = async (id) => {
        setData(data.filter((item) => item.id !== id));
        try {
            const res = await axiosInstance.delete(`/users/${id}`);
            console.log(data)
            if (res.status === 200) {
                props.enqueueSnackbar('Successfully deleted user', { variant: 'success' });
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }

        } catch (err) {
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }
    };

    const handleEdit = (id) => {
        setEditId(id);
        setShowEditDialog(true);
    };

    const handleCreate = () => {
        console.log('Button clicked')
        setShowAddDialog(true);
    }

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
                        <button className="buttonEdit" variant="contained"
                            onClick={() => handleEdit(params.row.id)}>Edit
                        </button>

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
            <Button className='buttonCreate' variant="contained" color="primary" onClick={() => handleCreate()}>
                Create new user
            </Button>
            <DataGrid className={classes.dataGrid}
                rows={data}
                disableSelectionOnClick
                columns={columns}
                pageSize={8}
                checkboxSelection
                autoHeight={true}
            >

            </DataGrid>
            {/* <Dialog open={true} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <User id={id} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog> */}
            {showEditDialog && <EditUser id={editId} toggle={() => setShowEditDialog(false)} />}
            {showAddDialog && <NewUser toggle={() => setShowAddDialog(false)} />}


        </div >
    );


}

export default withSnackbar(UserList);