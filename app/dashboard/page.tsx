"use client"

import * as React from "react"
import {
  AlertCircleIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ProjectStatus = "Planificado" | "En progreso" | "En revisión" | "Completado"
type TaskStatus = "Pendiente" | "En progreso" | "Completado"
type Priority = "Baja" | "Media" | "Alta" | "Urgente"
type BadgeVariant = React.ComponentProps<typeof Badge>["variant"]

type Project = {
  id: string
  title: string
  description: string
  status: ProjectStatus
  progress: number
  memberIds: string[]
}

type TeamMember = {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

type Task = {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: Priority
  userId: string
  dateline: string
}

type Settings = {
  companyName: string
  notificationEmail: string
  weeklyReports: boolean
  timezone: string
  defaultPriority: Priority
}

const initialProjects: Project[] = [
  {
    id: "prj-1",
    title: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con Next.js",
    status: "En progreso",
    progress: 65,
    memberIds: ["u-1", "u-2"],
  },
  {
    id: "prj-2",
    title: "Mobile App",
    description: "Aplicación móvil con React Native",
    status: "En revisión",
    progress: 90,
    memberIds: ["u-3"],
  },
  {
    id: "prj-3",
    title: "API Gateway",
    description: "Microservicios con Node.js",
    status: "Planificado",
    progress: 30,
    memberIds: ["u-2", "u-4"],
  },
]

const initialMembers: TeamMember[] = [
  {
    userId: "u-1",
    role: "admin",
    name: "María García",
    email: "maria@example.com",
    position: "Frontend Developer",
    birthdate: "1992-05-18",
    phone: "+51 987 111 222",
    projectId: "prj-1",
    isActive: true,
  },
  {
    userId: "u-2",
    role: "editor",
    name: "Juan Pérez",
    email: "juan@example.com",
    position: "Backend Developer",
    birthdate: "1989-08-02",
    phone: "+51 987 333 444",
    projectId: "prj-3",
    isActive: true,
  },
  {
    userId: "u-3",
    role: "viewer",
    name: "Ana López",
    email: "ana@example.com",
    position: "UI/UX Designer",
    birthdate: "1994-01-24",
    phone: "+51 987 555 666",
    projectId: "prj-2",
    isActive: false,
  },
  {
    userId: "u-4",
    role: "editor",
    name: "Carlos Ruiz",
    email: "carlos@example.com",
    position: "DevOps Engineer",
    birthdate: "1990-11-12",
    phone: "+51 987 777 888",
    projectId: "prj-3",
    isActive: true,
  },
]

const initialTasks: Task[] = [
  {
    id: "task-1",
    description: "Implementar autenticación",
    projectId: "prj-1",
    status: "En progreso",
    priority: "Alta",
    userId: "u-1",
    dateline: "2026-06-12",
  },
  {
    id: "task-2",
    description: "Diseñar pantalla de perfil",
    projectId: "prj-2",
    status: "Pendiente",
    priority: "Media",
    userId: "u-3",
    dateline: "2026-06-18",
  },
  {
    id: "task-3",
    description: "Configurar CI/CD",
    projectId: "prj-3",
    status: "Completado",
    priority: "Alta",
    userId: "u-4",
    dateline: "2026-06-02",
  },
  {
    id: "task-4",
    description: "Optimizar queries SQL",
    projectId: "prj-1",
    status: "En progreso",
    priority: "Urgente",
    userId: "u-2",
    dateline: "2026-06-08",
  },
]

const emptyProject: Project = {
  id: "",
  title: "",
  description: "",
  status: "Planificado",
  progress: 0,
  memberIds: [],
}

const emptyMember: TeamMember = {
  userId: "",
  role: "viewer",
  name: "",
  email: "",
  position: "",
  birthdate: "",
  phone: "",
  projectId: "",
  isActive: true,
}

const emptyTask: Task = {
  id: "",
  description: "",
  projectId: "",
  status: "Pendiente",
  priority: "Media",
  userId: "",
  dateline: "",
}

const defaultSettings: Settings = {
  companyName: "Nexa Studio",
  notificationEmail: "admin@example.com",
  weeklyReports: true,
  timezone: "America/Lima",
  defaultPriority: "Media",
}

const taskPageSize = 3

function createId(prefix: string) {
  return `${prefix}-${Date.now()}`
}

function toInputDate(date?: Date) {
  if (!date) return ""
  return date.toISOString().slice(0, 10)
}

function fromInputDate(value: string) {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function projectStatusVariant(status: ProjectStatus): BadgeVariant {
  if (status === "Completado") return "default"
  if (status === "En revisión") return "secondary"
  return "outline"
}

function taskStatusVariant(status: TaskStatus): BadgeVariant {
  if (status === "Completado") return "default"
  if (status === "En progreso") return "secondary"
  return "outline"
}

function priorityVariant(priority: Priority): BadgeVariant {
  if (priority === "Urgente") return "destructive"
  if (priority === "Alta") return "default"
  if (priority === "Media") return "secondary"
  return "outline"
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function FormAlert({ message }: { message: string }) {
  if (!message) return null

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Validación pendiente</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export default function DashboardPage() {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects)
  const [members, setMembers] = React.useState<TeamMember[]>(initialMembers)
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [settings, setSettings] = React.useState<Settings>(defaultSettings)

  const [projectForm, setProjectForm] = React.useState<Project>(emptyProject)
  const [memberForm, setMemberForm] = React.useState<TeamMember>(emptyMember)
  const [taskForm, setTaskForm] = React.useState<Task>(emptyTask)
  const [settingsForm, setSettingsForm] =
    React.useState<Settings>(defaultSettings)

  const [editingProjectId, setEditingProjectId] = React.useState<string | null>(
    null
  )
  const [editingMemberId, setEditingMemberId] = React.useState<string | null>(
    null
  )
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null)
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  )

  const [projectError, setProjectError] = React.useState("")
  const [memberError, setMemberError] = React.useState("")
  const [taskError, setTaskError] = React.useState("")
  const [settingsError, setSettingsError] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")
  const [loadingAction, setLoadingAction] = React.useState<string | null>(null)
  const [taskPage, setTaskPage] = React.useState(1)

  const projectById = React.useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    [projects]
  )
  const memberById = React.useMemo(
    () => new Map(members.map((member) => [member.userId, member])),
    [members]
  )

  const metrics = React.useMemo(() => {
    const completedTasks = tasks.filter((task) => task.status === "Completado")
    const activeMembers = members.filter((member) => member.isActive)
    const averageProgress =
      projects.length === 0
        ? 0
        : Math.round(
            projects.reduce((total, project) => total + project.progress, 0) /
              projects.length
          )

    return {
      projects: projects.length,
      completedTasks: completedTasks.length,
      activeMembers: activeMembers.length,
      averageProgress,
    }
  }, [members, projects, tasks])

  const paginatedTasks = React.useMemo(() => {
    const start = (taskPage - 1) * taskPageSize
    return tasks.slice(start, start + taskPageSize)
  }, [taskPage, tasks])

  const totalTaskPages = Math.max(1, Math.ceil(tasks.length / taskPageSize))

  function simulateBackend(action: string, onComplete: () => void) {
    setLoadingAction(action)
    window.setTimeout(() => {
      onComplete()
      setLoadingAction(null)
    }, 550)
  }

  function showSuccess(message: string) {
    setSuccessMessage(message)
    window.setTimeout(() => setSuccessMessage(""), 2200)
  }

  function saveProject() {
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      setProjectError("El proyecto necesita nombre y descripción.")
      return
    }

    setProjectError("")
    simulateBackend("project", () => {
      if (editingProjectId) {
        setProjects((current) =>
          current.map((project) =>
            project.id === editingProjectId
              ? { ...projectForm, id: editingProjectId }
              : project
          )
        )
        setEditingProjectId(null)
      } else {
        setProjects((current) => [
          ...current,
          { ...projectForm, id: createId("prj") },
        ])
      }
      setProjectForm(emptyProject)
      showSuccess("Proyecto guardado correctamente.")
    })
  }

  function editProject(project: Project) {
    setEditingProjectId(project.id)
    setProjectForm(project)
    setProjectError("")
  }

  function deleteProject(projectId: string) {
    simulateBackend(`delete-project-${projectId}`, () => {
      setProjects((current) => current.filter((project) => project.id !== projectId))
      setMembers((current) =>
        current.map((member) =>
          member.projectId === projectId ? { ...member, projectId: "" } : member
        )
      )
      setTasks((current) => current.filter((task) => task.projectId !== projectId))
      showSuccess("Proyecto eliminado y datos relacionados actualizados.")
    })
  }

  function saveMember() {
    if (
      !memberForm.userId.trim() ||
      !memberForm.name.trim() ||
      !memberForm.email.trim() ||
      !memberForm.position.trim()
    ) {
      setMemberError("Completa userId, nombre, email y puesto.")
      return
    }

    if (!memberForm.email.includes("@")) {
      setMemberError("El email debe tener un formato válido.")
      return
    }

    const duplicate = members.some(
      (member) =>
        member.userId === memberForm.userId && member.userId !== editingMemberId
    )
    if (duplicate) {
      setMemberError("Ya existe un miembro con ese userId.")
      return
    }

    setMemberError("")
    simulateBackend("member", () => {
      if (editingMemberId) {
        setMembers((current) =>
          current.map((member) =>
            member.userId === editingMemberId ? memberForm : member
          )
        )
        setEditingMemberId(null)
      } else {
        setMembers((current) => [...current, memberForm])
      }
      setMemberForm(emptyMember)
      showSuccess("Miembro guardado correctamente.")
    })
  }

  function editMember(member: TeamMember) {
    setEditingMemberId(member.userId)
    setMemberForm(member)
    setMemberError("")
  }

  function deleteMember(userId: string) {
    simulateBackend(`delete-member-${userId}`, () => {
      setMembers((current) => current.filter((member) => member.userId !== userId))
      setProjects((current) =>
        current.map((project) => ({
          ...project,
          memberIds: project.memberIds.filter((memberId) => memberId !== userId),
        }))
      )
      setTasks((current) =>
        current.map((task) =>
          task.userId === userId ? { ...task, userId: "" } : task
        )
      )
      showSuccess("Miembro eliminado correctamente.")
    })
  }

  function saveTask() {
    if (
      !taskForm.description.trim() ||
      !taskForm.projectId ||
      !taskForm.userId ||
      !taskForm.dateline
    ) {
      setTaskError("Completa descripción, proyecto, responsable y fecha límite.")
      return
    }

    setTaskError("")
    simulateBackend("task", () => {
      if (editingTaskId) {
        setTasks((current) =>
          current.map((task) =>
            task.id === editingTaskId ? { ...taskForm, id: editingTaskId } : task
          )
        )
        setEditingTaskId(null)
      } else {
        setTasks((current) => {
          const next = [...current, { ...taskForm, id: createId("task") }]
          setTaskPage(Math.ceil(next.length / taskPageSize))
          return next
        })
      }
      setTaskForm(emptyTask)
      showSuccess("Tarea guardada correctamente.")
    })
  }

  function editTask(task: Task) {
    setEditingTaskId(task.id)
    setTaskForm(task)
    setTaskError("")
  }

  function deleteTask(taskId: string) {
    simulateBackend(`delete-task-${taskId}`, () => {
      setTasks((current) => {
        const next = current.filter((task) => task.id !== taskId)
        setTaskPage((page) =>
          Math.min(page, Math.max(1, Math.ceil(next.length / taskPageSize)))
        )
        return next
      })
      showSuccess("Tarea eliminada correctamente.")
    })
  }

  function saveSettings() {
    if (!settingsForm.companyName.trim() || !settingsForm.notificationEmail.trim()) {
      setSettingsError("Completa la empresa y el correo de notificaciones.")
      return
    }

    if (!settingsForm.notificationEmail.includes("@")) {
      setSettingsError("El correo de notificaciones debe ser válido.")
      return
    }

    setSettingsError("")
    simulateBackend("settings", () => {
      setSettings(settingsForm)
      showSuccess("Configuración guardada correctamente.")
    })
  }

  function toggleProjectMember(memberId: string) {
    setProjectForm((current) => ({
      ...current,
      memberIds: current.memberIds.includes(memberId)
        ? current.memberIds.filter((id) => id !== memberId)
        : [...current.memberIds, memberId],
    }))
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,var(--accent),transparent_34%),linear-gradient(135deg,var(--background),var(--secondary))] p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Dashboard de Proyectos
            </h1>
            <p className="mt-2 text-muted-foreground">
              Gestión en memoria para proyectos, equipo, tareas y configuración.
            </p>
          </div>
          <Badge variant="secondary" className="h-7 px-3">
            {settings.companyName}
          </Badge>
        </div>

        {successMessage && (
          <Alert className="mb-4 border-primary/30 bg-primary/10">
            <CheckCircle2Icon />
            <AlertTitle>Operación completada</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Total Proyectos" value={metrics.projects} />
              <MetricCard
                label="Tareas Completadas"
                value={metrics.completedTasks}
              />
              <MetricCard label="Miembros Activos" value={metrics.activeMembers} />
              <MetricCard
                label="Progreso Promedio"
                value={`${metrics.averageProgress}%`}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Vista generada a partir de los datos actuales.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.slice(0, 4).map((task) => {
                  const member = memberById.get(task.userId)
                  const project = projectById.get(task.projectId)

                  return (
                    <div key={task.id} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {(member?.name ?? "NA")
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {task.description}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {member?.name ?? "Sin responsable"} ·{" "}
                          {project?.title ?? "Sin proyecto"}
                        </p>
                      </div>
                      <Badge variant={taskStatusVariant(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProjectId ? "Editar proyecto" : "Crear proyecto"}
                </CardTitle>
                <CardDescription>
                  Incluye miembros del equipo y completa el flujo de creación.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormAlert message={projectError} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Nombre">
                    <Input
                      value={projectForm.title}
                      onChange={(event) =>
                        setProjectForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Estado">
                    <Select
                      value={projectForm.status}
                      onValueChange={(value: ProjectStatus) =>
                        setProjectForm((current) => ({
                          ...current,
                          status: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Planificado", "En progreso", "En revisión", "Completado"].map(
                          (status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Descripción">
                    <Input
                      value={projectForm.description}
                      onChange={(event) =>
                        setProjectForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Progreso">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={projectForm.progress}
                      onChange={(event) =>
                        setProjectForm((current) => ({
                          ...current,
                          progress: Number(event.target.value),
                        }))
                      }
                    />
                  </Field>
                </div>
                <div className="space-y-2">
                  <Label>Miembros del equipo</Label>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    {members.map((member) => (
                      <label
                        key={member.userId}
                        className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
                      >
                        <Checkbox
                          checked={projectForm.memberIds.includes(member.userId)}
                          onCheckedChange={() => toggleProjectMember(member.userId)}
                        />
                        {member.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={saveProject} disabled={loadingAction === "project"}>
                    {loadingAction === "project" ? <Spinner /> : <SaveIcon />}
                    {editingProjectId ? "Actualizar" : "Crear proyecto"}
                  </Button>
                  {editingProjectId && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingProjectId(null)
                        setProjectForm(emptyProject)
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <CardTitle className="truncate text-lg">
                          {project.title}
                        </CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge variant={projectStatusVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="size-4" />
                      {project.memberIds.length} miembros asignados
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedProject(project)}
                      >
                        <EyeIcon />
                        Ver detalles
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editProject(project)}
                      >
                        <PencilIcon />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteProject(project.id)}
                        disabled={loadingAction === `delete-project-${project.id}`}
                      >
                        {loadingAction === `delete-project-${project.id}` ? (
                          <Spinner />
                        ) : (
                          <Trash2Icon />
                        )}
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingTaskId ? "Editar tarea" : "Crear tarea"}
                </CardTitle>
                <CardDescription>
                  CRUD de tareas con calendario y paginación.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormAlert message={taskError} />
                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Descripción">
                      <Input
                        value={taskForm.description}
                        onChange={(event) =>
                          setTaskForm((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Proyecto">
                      <ProjectSelect
                        value={taskForm.projectId}
                        projects={projects}
                        onChange={(value) =>
                          setTaskForm((current) => ({
                            ...current,
                            projectId: value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Responsable">
                      <MemberSelect
                        value={taskForm.userId}
                        members={members}
                        onChange={(value) =>
                          setTaskForm((current) => ({ ...current, userId: value }))
                        }
                      />
                    </Field>
                    <Field label="Estado">
                      <Select
                        value={taskForm.status}
                        onValueChange={(value: TaskStatus) =>
                          setTaskForm((current) => ({
                            ...current,
                            status: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Pendiente", "En progreso", "Completado"].map(
                            (status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Prioridad">
                      <Select
                        value={taskForm.priority}
                        onValueChange={(value: Priority) =>
                          setTaskForm((current) => ({
                            ...current,
                            priority: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Baja", "Media", "Alta", "Urgente"].map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Fecha límite">
                      <Input value={taskForm.dateline} readOnly />
                    </Field>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CalendarDaysIcon className="size-4" />
                      Calendario
                    </Label>
                    <Calendar
                      selected={fromInputDate(taskForm.dateline)}
                      onSelect={(date) =>
                        setTaskForm((current) => ({
                          ...current,
                          dateline: toInputDate(date),
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={saveTask} disabled={loadingAction === "task"}>
                    {loadingAction === "task" ? <Spinner /> : <PlusIcon />}
                    {editingTaskId ? "Actualizar tarea" : "Crear tarea"}
                  </Button>
                  {editingTaskId && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingTaskId(null)
                        setTaskForm(emptyTask)
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>
                  Página {taskPage} de {totalTaskPages}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Proyecto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Fecha límite</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.description}
                        </TableCell>
                        <TableCell>
                          {projectById.get(task.projectId)?.title ?? "Sin proyecto"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={taskStatusVariant(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={priorityVariant(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {memberById.get(task.userId)?.name ?? "Sin responsable"}
                        </TableCell>
                        <TableCell>{task.dateline}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => editTask(task)}
                            >
                              <PencilIcon />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteTask(task.id)}
                              disabled={loadingAction === `delete-task-${task.id}`}
                            >
                              {loadingAction === `delete-task-${task.id}` ? (
                                <Spinner />
                              ) : (
                                <Trash2Icon />
                              )}
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        disabled={taskPage === 1}
                        onClick={() => setTaskPage((page) => Math.max(1, page - 1))}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalTaskPages }, (_, index) => (
                      <PaginationItem key={index + 1}>
                        <PaginationLink
                          isActive={taskPage === index + 1}
                          onClick={() => setTaskPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        disabled={taskPage === totalTaskPages}
                        onClick={() =>
                          setTaskPage((page) => Math.min(totalTaskPages, page + 1))
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingMemberId ? "Editar miembro" : "Crear miembro"}
                </CardTitle>
                <CardDescription>
                  Campos: userId, role, name, email, position, birthdate, phone,
                  projectId e isActive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormAlert message={memberError} />
                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="userId">
                      <Input
                        value={memberForm.userId}
                        disabled={!!editingMemberId}
                        onChange={(event) =>
                          setMemberForm((current) => ({
                            ...current,
                            userId: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Rol">
                      <Select
                        value={memberForm.role}
                        onValueChange={(value) =>
                          setMemberForm((current) => ({
                            ...current,
                            role: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">admin</SelectItem>
                          <SelectItem value="editor">editor</SelectItem>
                          <SelectItem value="viewer">viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Nombre">
                      <Input
                        value={memberForm.name}
                        onChange={(event) =>
                          setMemberForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Email">
                      <Input
                        type="email"
                        value={memberForm.email}
                        onChange={(event) =>
                          setMemberForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Puesto">
                      <Input
                        value={memberForm.position}
                        onChange={(event) =>
                          setMemberForm((current) => ({
                            ...current,
                            position: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Teléfono">
                      <Input
                        value={memberForm.phone}
                        onChange={(event) =>
                          setMemberForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Proyecto">
                      <ProjectSelect
                        value={memberForm.projectId}
                        projects={projects}
                        allowEmpty
                        onChange={(value) =>
                          setMemberForm((current) => ({
                            ...current,
                            projectId: value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Activo">
                      <label className="flex h-8 items-center gap-2 rounded-lg border px-3 text-sm">
                        <Checkbox
                          checked={memberForm.isActive}
                          onCheckedChange={(checked) =>
                            setMemberForm((current) => ({
                              ...current,
                              isActive: checked === true,
                            }))
                          }
                        />
                        Miembro activo
                      </label>
                    </Field>
                    <Field label="Fecha de nacimiento">
                      <Input value={memberForm.birthdate} readOnly />
                    </Field>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CalendarDaysIcon className="size-4" />
                      Calendario
                    </Label>
                    <Calendar
                      selected={fromInputDate(memberForm.birthdate)}
                      onSelect={(date) =>
                        setMemberForm((current) => ({
                          ...current,
                          birthdate: toInputDate(date),
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={saveMember} disabled={loadingAction === "member"}>
                    {loadingAction === "member" ? <Spinner /> : <SaveIcon />}
                    {editingMemberId ? "Actualizar miembro" : "Crear miembro"}
                  </Button>
                  {editingMemberId && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingMemberId(null)
                        setMemberForm(emptyMember)
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Miembros del Equipo</CardTitle>
                <CardDescription>CRUD de miembros en memoria.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.userId}
                    className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {member.name}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {member.position} · {member.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {projectById.get(member.projectId)?.title ??
                            "Sin proyecto"}{" "}
                          · {member.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={member.isActive ? "default" : "secondary"}>
                        {member.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Badge variant="outline">{member.role}</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editMember(member)}
                      >
                        <PencilIcon />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMember(member.userId)}
                        disabled={loadingAction === `delete-member-${member.userId}`}
                      >
                        {loadingAction === `delete-member-${member.userId}` ? (
                          <Spinner />
                        ) : (
                          <Trash2Icon />
                        )}
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>
                  Formulario simulado para preferencias del dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormAlert message={settingsError} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Empresa">
                    <Input
                      value={settingsForm.companyName}
                      onChange={(event) =>
                        setSettingsForm((current) => ({
                          ...current,
                          companyName: event.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Correo de notificaciones">
                    <Input
                      type="email"
                      value={settingsForm.notificationEmail}
                      onChange={(event) =>
                        setSettingsForm((current) => ({
                          ...current,
                          notificationEmail: event.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Zona horaria">
                    <Select
                      value={settingsForm.timezone}
                      onValueChange={(value) =>
                        setSettingsForm((current) => ({
                          ...current,
                          timezone: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Lima">America/Lima</SelectItem>
                        <SelectItem value="America/Bogota">
                          America/Bogota
                        </SelectItem>
                        <SelectItem value="America/Mexico_City">
                          America/Mexico_City
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Prioridad por defecto">
                    <Select
                      value={settingsForm.defaultPriority}
                      onValueChange={(value: Priority) =>
                        setSettingsForm((current) => ({
                          ...current,
                          defaultPriority: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Baja", "Media", "Alta", "Urgente"].map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Reportes">
                    <label className="flex h-8 items-center gap-2 rounded-lg border px-3 text-sm">
                      <Checkbox
                        checked={settingsForm.weeklyReports}
                        onCheckedChange={(checked) =>
                          setSettingsForm((current) => ({
                            ...current,
                            weeklyReports: checked === true,
                          }))
                        }
                      />
                      Enviar resumen semanal
                    </label>
                  </Field>
                </div>
                <Button onClick={saveSettings} disabled={loadingAction === "settings"}>
                  {loadingAction === "settings" ? <Spinner /> : <SaveIcon />}
                  Guardar configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>{selectedProject?.description}</DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Detail label="Estado" value={selectedProject.status} />
                <Detail label="Progreso" value={`${selectedProject.progress}%`} />
                <Detail
                  label="Tareas"
                  value={String(
                    tasks.filter((task) => task.projectId === selectedProject.id)
                      .length
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Equipo asignado</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.memberIds.length === 0 && (
                    <Badge variant="outline">Sin miembros asignados</Badge>
                  )}
                  {selectedProject.memberIds.map((memberId) => (
                    <Badge key={memberId} variant="secondary">
                      {memberById.get(memberId)?.name ?? memberId}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <CheckCircle2Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">Actualizado en memoria</p>
      </CardContent>
    </Card>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

function ProjectSelect({
  value,
  projects,
  onChange,
  allowEmpty = false,
}: {
  value: string
  projects: Project[]
  onChange: (value: string) => void
  allowEmpty?: boolean
}) {
  return (
    <Select
      value={allowEmpty && !value ? "none" : value}
      onValueChange={(nextValue) => onChange(nextValue === "none" ? "" : nextValue)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecciona un proyecto" />
      </SelectTrigger>
      <SelectContent>
        {allowEmpty && <SelectItem value="none">Sin proyecto</SelectItem>}
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function MemberSelect({
  value,
  members,
  onChange,
}: {
  value: string
  members: TeamMember[]
  onChange: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecciona un responsable" />
      </SelectTrigger>
      <SelectContent>
        {members.map((member) => (
          <SelectItem key={member.userId} value={member.userId}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
