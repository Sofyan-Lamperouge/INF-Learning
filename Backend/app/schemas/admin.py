from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_mahasiswa: int
    total_materi: int
    # Nanti bisa ditambah: total_kuis, total_diskusi, dll.