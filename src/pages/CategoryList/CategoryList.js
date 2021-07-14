import "./CategoryList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from "../../utils/axios";
import { withSnackbar } from "notistack";
import moment from "moment";
import EditCategory from './../EditCategory/EditCategory';
import { Button } from "@material-ui/core";
import NewCategory from "../NewCategory/NewCategory";

const useStyles = makeStyles({

    dataGrid: {
        width: "100%",
        marginTop: '30px'
    },
});

function CategoryList(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);


    useEffect(function () {
        async function loadCategories() {
            const res = await axiosInstance.get('/categories?limit=999&sort_type=asc');
            if (res.data) {
                setData(res.data);
            }
        }
        loadCategories();
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await axiosInstance.delete(`/categories/${id}`);
            if (res.status === 200) {
                setData(data.filter((item) => item.id !== id));
                props.enqueueSnackbar('Successfully deleted category', { variant: 'success' });
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
                    <div className="listItem">
                        {/* <img className="docListImg" src={params.row.image || DEFAULT_COURSE_IMAGE} alt="" /> */}
                        {params.row.name}
                    </div>
                );
            },
        },
        {
            field: "last_update",
            headerName: "Last update",
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <div >
                        {moment(params.row.last_update).format('YYYY-MM-DD')}
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
        <div className="courseList">
            <h1>Category List</h1>
            <Button className='buttonCreate' variant="contained" color="primary" onClick={() => handleCreate()}>
                Create new category
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
            {showEditDialog && <EditCategory id={editId} toggle={() => setShowEditDialog(false)} />}
            {showAddDialog && <NewCategory toggle={() => setShowAddDialog(false)} />}

        </div >
    );


}

export default withSnackbar(CategoryList);