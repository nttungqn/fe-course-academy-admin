import "./UserList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from "../../utils/base";

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

    async function loadUsers() {
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
    useEffect(function () {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await axiosInstance.delete(`/users/${id}`);
            console.log(data)
            if (res.status === 200) {
                setData(data.filter((item) => item.id !== id));
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

    const handleEditOnClick = async (values) => {
        try {
            const res = await axiosInstance.put(`/users/${editId}`, values);
            console.log(res)
            if (res.status === 200) {
                props.enqueueSnackbar('Successfully updated user', { variant: 'success' });
                await loadUsers();
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }
            setShowEditDialog(false);
        } catch (err) {
            console.log(err);
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }

    }

    const handleAddOnClick = async (values, roles) => {
        try {
            let role_id;
            roles.forEach((role) => {
                if (role.name.toLowerCase() === 'teacher') {
                    role_id = role.id;
                }
            })
            const data = { ...values, role_id: role_id }
            const res = await axiosInstance.post(`/users`, data);

            if (res.status === 201) {
                props.enqueueSnackbar('Successfully created user', { variant: 'success' });
                await loadUsers();
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }
            setShowAddDialog(false);
        } catch (err) {
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }

    }

    const columns = [
        { field: "id", headerName: "ID", flex: 0.15 },
        {
            field: "user",
            headerName: "User",
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <div className="userListItem">
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
                    </>
                );
            },
        },
    ];

    return (
        <div className="userList">
            <h1>User List</h1>
            <Button className='buttonCreate' variant="contained" color="primary" onClick={() => handleCreate()}>
                Create new teacher
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

            {showEditDialog && <EditUser handle={handleEditOnClick} id={editId} toggle={() => setShowEditDialog(false)} />}
            {showAddDialog && <NewUser handle={handleAddOnClick} toggle={() => setShowAddDialog(false)} />}

        </div >
    );


}

export default withSnackbar(UserList);