"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface PlayerRaportPreviewProps {
  raportUrl: string;
  playerName: string;
}

export default function PlayerRaportPreview({
  raportUrl,
  playerName,
}: PlayerRaportPreviewProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="btn btn-primary-psg w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2"
        style={{
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: "1px",
          border: "none",
          cursor: "pointer",
        }}
      >
        <i className="fas fa-eye"></i>
        Preview Raport
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            bgcolor: "#1a1a1a",
            color: "white",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
          component="div"
        >
          <Box>
            <Typography variant="h6" fontWeight="800">
              Raport: {playerName}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.5)">
              Performance Evaluation PDF
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              component="a"
              href={raportUrl}
              download={`Raport_${playerName.replace(/\s+/g, "_")}.pdf`}
              startIcon={<FileDownloadIcon />}
              sx={{
                color: "#F5A623",
                textTransform: "none",
                fontWeight: "700",
                "&:hover": { bgcolor: "rgba(255,193,7,0.1)" },
              }}
            >
              Download
            </Button>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                color: "rgba(255,255,255,0.5)",
                "&:hover": { color: "white" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: "80vh", bgcolor: "#000" }}>
          <iframe
            src={`${raportUrl}#toolbar=0`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title={`Raport Preview - ${playerName}`}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
