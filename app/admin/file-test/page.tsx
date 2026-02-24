"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  TextField,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  CldUploadWidget,
  CldImage,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

interface UploadedFile {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  original_filename: string;
}

export default function FileTestPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/cloudinary-assets");
      const data = await response.json();
      if (response.ok) {
        setFiles(data.assets);
      } else {
        setError(data.error || "Failed to fetch existing assets");
      }
    } catch (err) {
      setError("An error occurred while fetching assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    console.log("Upload success:", result);
    if (
      result.event === "success" &&
      result.info &&
      typeof result.info !== "string"
    ) {
      const info = result.info;
      const newFile: UploadedFile = {
        publicId: info.public_id,
        url: info.url,
        secureUrl: info.secure_url,
        format: info.format,
        width: info.width,
        height: info.height,
        original_filename: info.original_filename,
      };
      setFiles((prev) => [newFile, ...prev]);
      setError(null);
    }
  };

  const handleUploadError = (error: unknown) => {
    console.error("Upload error:", error);
    setError(
      "Failed to upload file. Please check your Cloudinary configuration and Upload Preset.",
    );
  };

  const handleDelete = (publicId: string) => {
    setFiles((prev) => prev.filter((f) => f.publicId !== publicId));
  };

  const isImage = (format: string) => {
    return ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"].includes(
      format.toLowerCase(),
    );
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="black">
        File Upload Test
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This page allows you to test file uploads to Cloudinary.
        <strong>Note:</strong> Uploaded files are only stored in the current
        session state and will disappear on page refresh. Make sure you have an{" "}
        <strong>unsigned upload preset</strong> configured in your Cloudinary
        Dashboard.
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" mb={2} color="black">
            Upload New File
          </Typography>
          <CldUploadWidget
            uploadPreset={
              process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
              "champions_kids"
            }
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
          >
            {({ open }) => (
              <Button
                variant="contained"
                onClick={() => open()}
                size="large"
                startIcon={<VisibilityIcon />}
              >
                Open Upload Widget
              </Button>
            )}
          </CldUploadWidget>
        </CardContent>
      </Card>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Uploaded Files ({files.length})</Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={fetchAssets}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh List"}
        </Button>
      </Box>

      {loading && files.length === 0 ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : files.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "action.hover" }}>
          <Typography color="text.secondary">No files uploaded yet.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Preview</TableCell>
                <TableCell>Filename</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>Dimensions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.publicId}>
                  <TableCell>
                    {isImage(file.format) ? (
                      <CldImage
                        width="60"
                        height="60"
                        src={file.publicId}
                        alt={file.original_filename}
                        crop={{
                          type: "auto",
                          source: true,
                        }}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: "grey.200",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "1px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        {file.format.toUpperCase()}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {file.original_filename}.{file.format}
                  </TableCell>
                  <TableCell>{file.format}</TableCell>
                  <TableCell>
                    {file.width} x {file.height}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component="a"
                      href={file.secureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Original"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      component="a"
                      href={file.secureUrl.replace(
                        "/upload/",
                        "/upload/fl_attachment/",
                      )}
                      download
                      title="Download"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(file.publicId)}
                      color="error"
                      title="Remove from list"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
