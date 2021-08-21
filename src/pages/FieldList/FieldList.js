import "./FieldList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from "../../utils/base";

import EditField from './../EditField/EditField';
import { withSnackbar } from "notistack";
import { DEFAULT_COURSE_IMAGE } from "../../config";
import NewField from "../NewField/NewField";
import { Button } from "@material-ui/core";
import CircularIndeterminate from "../../components/CircularIndeterminate/CircularIndeterminate";

const useStyles = makeStyles({

    dataGrid: {
        width: "100%",
        marginTop: '30px'
    },
});

function FieldList(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [loadingBar, setLoadingBar] = useState(false);

    async function loadDocuments() {
        const res = await axiosInstance.get('/fields?limit=999&sort_type=asc');
        if (res.data) {
            setData(res.data);
        }
    }

    useEffect(function () {
        loadDocuments()
    }, []);

    const handleDelete = async (id) => {
        try {
            setLoadingBar(true);
            const res = await axiosInstance.delete(`/fields/${id}`);
            setLoadingBar(false);
            if (res.status === 200) {
                setData(data.filter((item) => item.id !== id));
                props.enqueueSnackbar('Successfully deleted fields', { variant: 'success' });
            } else {
                props.enqueueSnackbar('Failed done the operation.' + res.data.message, { variant: 'error' });
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
        setShowAddDialog(true);
    }

    const columns = [
        { field: "id", headerName: "ID", flex: 0.15 },
        {
            field: "url", headerName: "Image", flex: 0.15, renderCell: (params) => {
                return (
                    <img className="courseListImg" src={params.row.image !== "null" ? (params.row.image || DEFAULT_COURSE_IMAGE) : DEFAULT_COURSE_IMAGE} alt="" />
                );
            },
        },
        {
            field: "name",
            headerName: "Name",
            flex: 0.3,
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

    const handleEditOnClick = async (values) => {
        try {
            setLoadingBar(true);
            const res = await axiosInstance.put(`/fields/${editId}`, values);
            setLoadingBar(false);
            if (res.status === 200 || res.status === 202) {
                props.enqueueSnackbar('Successfully updated field', { variant: 'success' });
                await loadDocuments();
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }
            setShowEditDialog(false);
        } catch (err) {
            console.log(err);
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }

    }

    const handleAddOnClick = async (initialValues, values) => {

        try {
            let data = { ...initialValues, ...values }
            setLoadingBar(true);
            const res = await axiosInstance.post(`/fields`, data);
            setLoadingBar(false);
            if (res.status === 200 || res.status === 201) {
                props.enqueueSnackbar('Successfully add field', { variant: 'success' });
                await loadDocuments();
            } else {
                props.enqueueSnackbar('Failed done the operation.' + res.data.message, { variant: 'error' });
            }
            setShowAddDialog(false);
        } catch (err) {
            console.log(err);
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }
    }

    return (
        <div className="fieldList">
            <h1>Field List</h1>
            <Button className='buttonCreate' variant="contained" color="primary" onClick={() => handleCreate()}>
                Create new field
            </Button>
            {loadingBar ? <CircularIndeterminate /> :
                <DataGrid className={classes.dataGrid}
                    rows={data}
                    disableSelectionOnClick
                    columns={columns}
                    pageSize={8}
                    checkboxSelection
                    autoHeight={true}
                >

                </DataGrid>
            }

            {showEditDialog && <EditField handle={handleEditOnClick} id={editId} toggle={() => setShowEditDialog(false)} />}
            {showAddDialog && <NewField handle={handleAddOnClick} toggle={() => setShowAddDialog(false)} />}


        </div >
    );
}

export default withSnackbar(FieldList);