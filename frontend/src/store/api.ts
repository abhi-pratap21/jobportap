import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Application,
  Company,
  CompanyDetail,
  Job,
  JobsQuery,
  JobsResponse,
  Meta,
  Profile,
} from '@/lib/types';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Jobs', 'Job', 'Applications', 'Saved', 'Profile'],
  endpoints: (builder) => ({
    getMeta: builder.query<Meta, void>({
      query: () => '/meta',
    }),
    getJobs: builder.query<JobsResponse, JobsQuery>({
      query: (params) => ({ url: '/jobs', params: params as Record<string, string> }),
      providesTags: ['Jobs'],
    }),
    getFeaturedJobs: builder.query<Job[], void>({
      query: () => '/jobs/featured',
      providesTags: ['Jobs'],
    }),
    getJob: builder.query<Job, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Job', id }],
    }),
    getSimilarJobs: builder.query<Job[], string>({
      query: (id) => `/jobs/${id}/similar`,
    }),
    getCompanies: builder.query<Company[], void>({
      query: () => '/companies',
    }),
    getCompany: builder.query<CompanyDetail, string>({
      query: (id) => `/companies/${id}`,
    }),
    getApplications: builder.query<Application[], void>({
      query: () => '/applications',
      providesTags: ['Applications'],
    }),
    applyToJob: builder.mutation<Application, { jobId: string; coverNote?: string }>({
      query: (body) => ({ url: '/applications', method: 'POST', body }),
      invalidatesTags: (_r, _e, { jobId }) => ['Applications', 'Profile', { type: 'Job', id: jobId }],
    }),
    withdrawApplication: builder.mutation<{ withdrawn: boolean; id: string }, string>({
      query: (id) => ({ url: `/applications/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Applications', 'Profile'],
    }),
    getSavedJobs: builder.query<Job[], void>({
      query: () => '/saved-jobs',
      providesTags: ['Saved'],
    }),
    saveJob: builder.mutation<{ saved: boolean; jobId: string }, string>({
      query: (jobId) => ({ url: '/saved-jobs', method: 'POST', body: { jobId } }),
      invalidatesTags: (_r, _e, jobId) => ['Saved', 'Profile', { type: 'Job', id: jobId }],
    }),
    unsaveJob: builder.mutation<{ saved: boolean; jobId: string }, string>({
      query: (jobId) => ({ url: `/saved-jobs/${jobId}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, jobId) => ['Saved', 'Profile', { type: 'Job', id: jobId }],
    }),
    getProfile: builder.query<Profile, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<Profile, Partial<Profile>>({
      query: (body) => ({ url: '/profile', method: 'PUT', body }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetMetaQuery,
  useGetJobsQuery,
  useGetFeaturedJobsQuery,
  useGetJobQuery,
  useGetSimilarJobsQuery,
  useGetCompaniesQuery,
  useGetCompanyQuery,
  useGetApplicationsQuery,
  useApplyToJobMutation,
  useWithdrawApplicationMutation,
  useGetSavedJobsQuery,
  useSaveJobMutation,
  useUnsaveJobMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = api;
