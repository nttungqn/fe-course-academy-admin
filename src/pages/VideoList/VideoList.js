import "./VideoList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from "../../utils/base";
import { withSnackbar } from "notistack";
import EditVideo from './../EditVideo/EditVideo';
import CircularIndeterminate from "../../components/CircularIndeterminate/CircularIndeterminate";

const useStyles = makeStyles({

    dataGrid: {
        width: "100%",
        marginTop: '30px'
    },
});

function VideoList(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [loadingBar, setLoadingBar] = useState(false);

    async function loadVideos() {
        setLoadingBar(true);
        const res = await axiosInstance.get('/videos?limit=999&sort_type=asc');
        setLoadingBar(false);
        if (res.data) {
            let videos = res.data.map((el) => {
                el['video']['course_name'] = el['course']['name'];
                delete el['course'];
                return el['video'];
            });
            setData(videos);
        }
    }
    useEffect(function () {
        loadVideos()
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await axiosInstance.delete(`/videos/${id}`);
            if (res.status === 200) {
                setData(data.filter((item) => item.id !== id));
                props.enqueueSnackbar('Successfully deleted videos', { variant: 'success' });
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

    const columns = [
        { field: "id", headerName: "ID", flex: 0.15 },
        {
            field: "name",
            headerName: "Name",
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <div className="docListItem">
                        {/* <img className="docListImg" src={params.row.image || DEFAULT_COURSE_IMAGE} alt="" /> */}
                        {params.row.name}
                    </div>
                );
            },
        },
        {
            field: "course_name",
            headerName: "Course",
            flex: 0.2,
        },
        {
            field: "url",
            headerName: "URL",
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

    const handleEditOnClick = async (values) => {

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 10000 };
            let fd = new FormData();
            for (let key in values) {
                if (values.hasOwnProperty(key)) {
                    fd.append(key, values[key]);
                }
            }
            const res = await axiosInstance.put(`/videos/${editId}`, fd, config);
            console.log(res)
            if (res.status === 200 || res.status === 202) {
                props.enqueueSnackbar('Successfully updated video', { variant: 'success' });
                await loadVideos();
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }
            setShowEditDialog(false);
        } catch (err) {
            console.log(err);
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }

    }

    return (
        <div className="courseList">
            <h1>Video List</h1>
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
            {showEditDialog && <EditVideo handle={handleEditOnClick} id={editId} toggle={() => setShowEditDialog(false)} />}


        </div >
    );


}

export default withSnackbar(VideoList);