"use client"

import dynamic from "next/dynamic"
import { ComponentType } from "react"

// Dynamically import recharts components with SSR disabled
export const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
) as ComponentType<any>

export const BarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { ssr: false }
) as ComponentType<any>

export const Bar = dynamic(
  () => import("recharts").then((mod) => mod.Bar),
  { ssr: false }
) as ComponentType<any>

export const PieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  { ssr: false }
) as ComponentType<any>

export const Pie = dynamic(
  () => import("recharts").then((mod) => mod.Pie),
  { ssr: false }
) as ComponentType<any>

export const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false }
) as ComponentType<any>

export const Line = dynamic(
  () => import("recharts").then((mod) => mod.Line),
  { ssr: false }
) as ComponentType<any>

export const Cell = dynamic(
  () => import("recharts").then((mod) => mod.Cell),
  { ssr: false }
) as ComponentType<any>

export const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false }
) as ComponentType<any>

export const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false }
) as ComponentType<any>

export const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
) as ComponentType<any>

export const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
) as ComponentType<any>

export const Legend = dynamic(
  () => import("recharts").then((mod) => mod.Legend),
  { ssr: false }
) as ComponentType<any>

