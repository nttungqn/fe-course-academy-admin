import "./CategoryList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from "../../utils/base";
import { withSnackbar } from "notistack";
import moment from "moment";
import EditCategory from './../EditCategory/EditCategory';
import { Button } from "@material-ui/core";
import NewCategory from "../NewCategory/NewCategory";
import CircularIndeterminate from "../../components/CircularIndeterminate/CircularIndeterminate";

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
    const [loadingBar, setLoadingBar] = useState(false);

    async function loadCategories() {
        const res = await axiosInstance.get('/categories?limit=999&sort_type=asc');
        if (res.data) {
            let data = res.data.map(el => {
                el['last_update'] = moment(el['last_update']).format('YYYY-MM-DD')
                return el;
            })
            setData(res.data);
        }
    }

    useEffect(function () {
        loadCategories();
    }, []);

    const handleDelete = async (id) => {
        try {
            setLoadingBar(true);
            const res = await axiosInstance.delete(`/categories/${id}`);
            setLoadingBar(false);
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
            type: 'date',
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
            const res = await axiosInstance.put(`/categories/${editId}`, values);
            setLoadingBar(false);
            console.log(res)
            if (res.status === 200 || res.status === 202) {
                props.enqueueSnackbar('Successfully updated document', { variant: 'success' });
                await loadCategories();
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

            const res = await axiosInstance.post(`/categories`, data);

            if (res.status === 200 || res.status === 201) {
                props.enqueueSnackbar('Successfully add category', { variant: 'success' });
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }
            setShowAddDialog(false);
        } catch (err) {
            console.log(err);
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }

    }

    return (
        <div className="courseList">
            <h1>Category List</h1>
            <Button className='buttonCreate' variant="contained" color="primary" onClick={() => handleCreate()}>
                Create new category
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
            {showEditDialog && <EditCategory handle={handleEditOnClick} id={editId} toggle={() => setShowEditDialog(false)} />}
            {showAddDialog && <NewCategory handle={handleAddOnClick} toggle={() => setShowAddDialog(false)} />}

        </div >
    );


}

export default withSnackbar(CategoryList);