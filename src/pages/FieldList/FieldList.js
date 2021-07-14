import "./FieldList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from "../../utils/axios";

import EditField from './../EditField/EditField';
import { withSnackbar } from "notistack";
import { DEFAULT_COURSE_IMAGE } from "../../config";
import NewField from "../NewField/NewField";
import { Button } from "@material-ui/core";

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

    useEffect(function () {
        async function loadDocuments() {
            const res = await axiosInstance.get('/fields?limit=999&sort_type=asc');
            if (res.data) {
                setData(res.data);
            }
        }
        loadDocuments()
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await axiosInstance.delete(`/fields/${id}`);
            if (res.status === 200) {
                setData(data.filter((item) => item.id !== id));
                props.enqueueSnackbar('Successfully deleted fields', { variant: 'success' });
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
        setShowAddDialog(true);
    }

    const columns = [
        { field: "id", headerName: "ID", flex: 0.15 },
        {
            field: "name",
            headerName: "Name",
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <div className="fieldListItem">
                        <img className="fieldListImg" src={params.row.image || DEFAULT_COURSE_IMAGE} alt="" />
                        {params.row.name}
                    </div>
                );
            },
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
        <div className="fieldList">
            <h1>Field List</h1>
            <Button className='buttonCreate' variant="contained" color="primary" onClick={() => handleCreate()}>
                Create new field
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

            {showEditDialog && <EditField id={editId} toggle={() => setShowEditDialog(false)} />}
            {showAddDialog && <NewField toggle={() => setShowAddDialog(false)} />}


        </div >
    );


}

export default withSnackbar(FieldList);