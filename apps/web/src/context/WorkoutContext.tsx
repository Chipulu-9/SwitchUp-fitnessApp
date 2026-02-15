import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import type { Workout } from '@repo/shared'

interface WorkoutContextType {
  workouts: Workout[]
  loading: boolean
  addWorkout: (data: Omit<Workout, 'id'>) => Promise<void>
  updateWorkout: (id: string, data: Partial<Workout>) => Promise<void>
  deleteWorkout: (id: string) => Promise<void>
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  // Real-time listener for workouts
  useEffect(() => {
    if (!user) {
      setWorkouts([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'workouts'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    )

    // onSnapshot provides real-time updates automatically
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Workout[]
        setWorkouts(data)
        setLoading(false)
      },
      error => {
        console.error('Error listening to workouts:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const addWorkout = async (data: Omit<Workout, 'id'>) => {
    if (!user) return
    await addDoc(collection(db, 'workouts'), {
      ...data,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    })
  }

  const updateWorkout = async (id: string, data: Partial<Workout>) => {
    await updateDoc(doc(db, 'workouts', id), {
      ...data,
      updatedAt: new Date().toISOString(),
    })
  }

  const deleteWorkout = async (id: string) => {
    await deleteDoc(doc(db, 'workouts', id))
  }

  return (
    <WorkoutContext.Provider
      value={{ workouts, loading, addWorkout, updateWorkout, deleteWorkout }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

export const useWorkouts = () => {
  const context = useContext(WorkoutContext)
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider')
  }
  return context
}
