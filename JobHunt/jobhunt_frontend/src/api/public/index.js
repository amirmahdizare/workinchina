import moment from "moment"
import { api, centralApi } from "../../config/apiConfig"
import { centralApiHeaderObj, getLanguage, getServiceId, getUserToken, makeSearchQueryString } from "../../utils"

const getPopularCategories = async (customParams) => {
    const reqParams = customParams && customParams.page && customParams.pagination_size ? customParams : { page: 1, pagination_size: 6 }
    const response = await api.get('/categories/guests', {
        headers: { Lang: getLanguage() },
        params: reqParams
    })
    const data = Promise.all(Object.values(response.data.data).map(async (item) => ({ ...item, openPositions: await getCategoryOpenPositions(item.id) })))
    return data
}

const getAllCategories = async () => {
    const response = await api.get('/categories/guests', {
        headers: { Lang: getLanguage() },
    })
    return Object.values(response.data.data)
}

const getCountryInfoToSignup = async (countryName) => {
    const response = await centralApi.get('/countries', {
        params: {
            page: 1,
            pagination_size: 250,
            name: countryName
        },
        headers: centralApiHeaderObj()
    })
    return response.data.data.entities
}


const getValidCountriesToSignupDetail = async () => {
    let countries = []
    try {
        countries = await getCountryInfoToSignup()

    } catch (error) {
        // break
    }
    return countries
}

const getSingleCountryInfo = async ({ country }) => {
    const response = await centralApi.get('/countries', {
        params: {
            name: country,
            page: 1
        },
        headers: centralApiHeaderObj()
    })
    return response.data.data.entities[0]
}

const getUserIdentifier = async () => {
    const response = await api.get('/users/profile', {
        headers: {
            Authorization: 'Bearer ' + getUserToken(),
            Lang: getLanguage()
        }
    })
    return response.data.data.email || response.data.data.country_code + ' ' + response.data.data.mobile
}

const getFeaturedJobs = async () => {
    const response = await api.get('/jobs/offers/guests', {
        headers: {
            Lang: getLanguage()
        },
        params: {
            page: 1,
            pagination_size: 6,
        }
    })
    const { data: { data } } = response
    return data

}

const getExperiences = async () => {
    const response = await api.get('/experiences/guests', {
        headers: {
            Lang: getLanguage()
        },
        params: {
            page: 1,
            pagination_size: 6
        }
    })
    const { data: { data: { entities } } } = response
    const fullDetailData = Promise.all(entities.map(async (experience) => ({ ...experience, image: experience.user_info.image ? Object.values(experience.user_info.image)[0] : null })))
    return fullDetailData
}

const getPartners = async (customParams) => {
    const reqParams = customParams && customParams.page && customParams.pagination_size ? customParams : { page: 1, pagination_size: 6 }
    const response = await api.get('/partners/guests', {
        headers: {
            Lang: getLanguage()
        },
        params: reqParams

    })
    const { data: { data: { entities, number_of_pages } } } = response
    const fullDetailData = await Promise.all(entities.map(async (partner) => ({ ...partner, logo: Object.values(partner.logo)[0] })))

    return { partners: fullDetailData, pages: number_of_pages }
}

const getBlogs = async (params) => {
    const response = await api.get('blogs/guests', {
        headers: {
            Lang: getLanguage()
        },
        params: params ? params : { page: 1, pagination_size: 3 }
    })
    const { data: { data: { entities, number_of_pages } } } = response
    console.log(entities)

    const posts = await Promise.all(entities.map(async (blog, index) => ({ ...blog, image: Object.values(blog.medias)[0], date: moment(blog.created_at).format('DD MMM, YYYY') })))
    return { posts, pages: number_of_pages }
}

const getFAQs = async (customParams) => {
    const reqParams = customParams && customParams.page && customParams.pagination_size ? customParams : { page: 1, pagination_size: 6 }
    const response = await api.get('/faqs/guests', {
        headers: { Lang: getLanguage() },
        params: reqParams
    })
    const { data: { data: { entities, number_of_pages } } } = response
    return { faqs: entities, pages: number_of_pages }
}
const getTerms = async (customParams) => {
    const reqParams = customParams && customParams.page && customParams.pagination_size ? customParams : { page: 1, pagination_size: 6 }
    const response = await api.get('/terms/guests', {
        headers: { Lang: getLanguage() },
        params: reqParams
    })
    const { data: { data: { entities, number_of_pages } } } = response
    return { terms: entities, pages: number_of_pages }
}

const getCategoryDetailById = async (id) => {
    const response = await api.get(`/categories/guests/${id}`, {
        headers: {
            Lang: getLanguage()
        }
    })
    return response.data.data.title
}

const getJobWorktimes = async (id) => {
    const response = await api.get(`/cooperation-kinds/guests?page=1`, {
        headers: {
            Lang: getLanguage()
        }
    })
    var result = []
    let times = response.data.data
    for (let item in times) {
        result.push({
            cooperation_kind_id: item,
            title: times[item]
        })
    }
    return result
}
const getAboutUsDescription = async () => {
    const response = await api.get(`/preambles/guests`, {
        headers: {
            Lang: getLanguage()
        }
    })

    const { data: { data } } = response
    const fullDetailData = { ...data, image: Object.values(data.media)[0] }
    return fullDetailData
}

const getOverServices = async () => {
    const response = await api.get(`/services/guests?page=1`, {
        headers: {
            Lang: getLanguage()
        }
    })

    return response.data.data.entities
}

const getStatistics = async () => {

    const getCount = async (endpoint) => {
        const response = await api.get(endpoint, {
            headers: {
                Lang: getLanguage()
            }
        })
        return response.data.data.number_of_entities
    }

    try {
        var jobsCount = await getCount('/jobs/offers/guests?page=1')
        var companiesCount = await getCount('/companies/guest?page=1')
        var usersCount = await getCount('/users/guests/counts?page=1')
    } catch (error) {
        return {}
    }

    return { jobsCount, companiesCount, usersCount }
}

const getAllCorporations = async () => {
    const response = await api.get('/cooperation-kinds/guests?page=1', {
        headers: {
            Lang: getLanguage()
        }
    })
    return response.data.data
}

const getAllJobs = async (page, paginationSize, query) => {
    const response = await api.get(`/jobs/offers/guests?page=${page}&pagination_size=${paginationSize}${query ? `${query}` : ''}`, {
        headers: {
            Lang: getLanguage()
        }
    })
    return response.data.data
}

const getSpecificCompany = async (id) => {
    const response = await api.get(`/companies/guest/${id}`, {
        headers: {
            Lang: getLanguage()
        }
    })
    return response.data.data
}

const getSpecificCorporation = async (id) => {
    const response = await api.get(`/cooperation-kinds/guests/${id}`, {
        headers: {
            Lang: getLanguage()
        }
    })
    return response.data.data
}

const getSingleJob = async (id) => {
    const response = await api.get(`/jobs/offers/guests/${id}`, {
        headers: {
            Lang: getLanguage()
        }
    })
    return response.data.data
}

const postContactUs = async (data) => {
    const response = await api.post('/contact-us/guests', data, {
        headers: { Lang: getLanguage() },
    })
    return await Object.values(response)
}
const getContactInfo = async () => {
    try {
        const response = await api.get('/contact-infos/guests', {
            headers: { Lang: getLanguage() },
        })
        return response.data.data

    } catch (error) {
        return Promise.reject(new Error('No Info Found'))
    }
}

const getTopJobs = async () => {
    const response = await api.get('/jobs/offers/guests', {
        headers: { Lang: getLanguage() },
        params: {
            page: 1,
            pagination_size: 6,
            // 'filters[0][field]': 'is_special',
            // 'filters[0][value]': 'true'
        }
    })
    const plainJobs = response.data.data.entities
    console.log(plainJobs)
    return await Promise.all(plainJobs.map(async (job) => await jobDetailGenerator(job)))
}
const jobDetailGenerator = async (job) => {
    try {
        var { logo, name } = await getCompanyDetailById(job.company?.id)
        console.log(await getCompanyDetailById(job.company?.id))
        var { title, color } = await getCooperationKindById(job.cooperation_kind_id)
    } catch (error) {
        //catch error
    }
    return {
        ...job,
        company_name: name,
        company_logo: logo,
        cooperation_kind_title: title || 'Unset',
        cooperation_kind_color: color
    }

}
const getCompanyDetailById = async (id) => {
    try {
        const response = await api.get('/companies/guest/' + id, {
            headers: { Lang: getLanguage() },
        })
        const { data: { data: { logo, category_id } } } = response
        const category = await getCategoryDetailById(category_id) || null
        if (typeof logo == 'object') {
            const logoPath = Object.values(logo)?.[0]
            return Promise.resolve({ ...response.data.data, category, logo:logoPath })
        }
        else {
            return Promise.resolve({ ...response.data.data, category })
        }

    } catch (error) {
        return Promise.reject(new Error('No Info Found'))
    }
}
const getCooperationKindById = async (id) => {
    try {
        const response = await api.get('/cooperation-kinds/guests/' + id, {
            headers: { Lang: getLanguage() },
        })
        return response.data.data

    } catch (error) {
        return Promise.reject(new Error('No Info Found'))
    }
}
const getHowWorks = async (page) => {
    const response = await api.get(`/workflows/guests`, {
        headers: {
            Lang: getLanguage()
        },
        params: { page: page ? page : 1 }
    })

    const { data: { data: { entities } } } = response
    const fullDetailData = Promise.all(entities.map(async (info) => ({ ...info, image: Object.values(info.media)[0]})))
    return fullDetailData
}
const getPolicies = async (customParams) => {
    const reqParams = customParams && customParams.page && customParams.pagination_size ? customParams : { page: 1, pagination_size: 6 }
    const response = await api.get(`/policies/guests`, {
        headers: {
            Lang: getLanguage()
        },
        params: reqParams
    })
    const { data: { data: { entities, number_of_pages } } } = response
    return { policies: entities, pages: number_of_pages }


}
const getPricing = async (page) => {
    const response = await api.get(`/packages/guests`, {
        headers: {
            Lang: getLanguage()
        },
        params: {
            page: page ? page : 1,
            service_name: "Company",
        },


    })
    const { data: { data } } = response
    return data
}

const getBlogSingle = async ({ id }) => {
    const response = await api.get(`blogs/guests/${id}`, {
        headers: {
            Lang: getLanguage()
        },

    })
    const { data: { data } } = response
    const fullDetailData = { ...data, image:  Object.values(data.medias)[0], date: moment(data.created_at).format('DD MMM, YYYY') }
    
    return fullDetailData
}
const getBlogSingleComment = async ({ entity_id, page, pagination_size }) => {
    
    const response = await api.get(`/comments/guests`, {
        headers: {
            Lang: getLanguage()
        },
        params: {
            page: page,
            entity_id: entity_id,
            pagination_size
        }

    })
    const { data: { data: { entities, number_of_pages, number_of_entities } } } = response
    const comments = await Promise.all(entities.map(async (comment, index) => ({ ...comment, image: comment.user_info.image ?  Object.values(comment.user_info.image)[0].path : null, date: moment(comment.created_at).format('DD MMM, YYYY') })))
    
    return { comments, pages: number_of_pages, number_of_entities }
}

const getChinaStates = async () => {
    const response = await centralApi.get(`/countries/61042fec9703294a6e37ef67/states`, {
        headers: {
            Lang: getLanguage(),
            'Service-ID': getServiceId()
        },
    })

    return response.data.data
}
const getStateCities = async ({ state_id }) => {
    const response = await centralApi.get(`/countries/61042fec9703294a6e37ef67/states/${state_id}/cities`, {
        headers: {
            Lang: getLanguage(),
            'Service-ID': getServiceId()
        },
    })
    return response.data.data
}


const getCandidateInfo = async ({ id }) => {
    try {
        const response = await api.get(`/candidates/guests/${id}`, {
            headers: {
                Lang: getLanguage(),
                'Content-Type': 'application/json'
            },
        })
        return Promise.resolve(response.data.data)

    } catch (error) {
        return Promise.reject(error.response.data.message)
    }
}

const getCompanies = async ({ page, pagination_size, filter }) => {
    try {
        const filters = makeSearchQueryString(filter)
        const response = await api.get(`/companies/guest?` + (filters || ''), {
            headers: {
                Lang: getLanguage(),
                'Content-Type': 'application/json'
            },
            params: {
                page, pagination_size
            }
        })
        var { data: { data: { entities, number_of_pages, number_of_entities } } } = response
        entities = await Promise.all(entities.map(async (emp) => {
            if (emp.logo) {

                const logoPath = emp?.logo ? Object.values(emp?.logo)?.[0] : null
                return { ...emp, logo: logoPath ?  logoPath : null }
            }
            else
                return emp

        }
        ))
        return Promise.resolve({ entities, number_of_pages, number_of_entities })

    } catch (error) {
        return Promise.reject(error.response.data.message)
    }
}

const getCategoryOpenPositions = async (id) => {
    try {
        const response = await api.get(`/jobs/offers/guests?page=1&filters[0][field]=category_id&filters[0][value][0]=${id}`, {
            headers: {
                Lang: getLanguage(),
                'Content-Type': 'application/json'
            },
        })
        return response.data.data.number_of_entities

    } catch (error) {
        return Promise.reject(error.response.data.message)
    }
}
const getAllJobOffers = async () => {
    try {
        const response = await api.get(`/jobs/offers/guests`, {
            headers: {
                Lang: getLanguage(),
                'Content-Type': 'application/json'
            },
            params: {
                page: 1
            }
        })
        return response.data.data.number_of_entities

    } catch (error) {
        return Promise.reject(error.response.data.message)
    }
}
const getTodayJobs = async () => {
    try {
        const response = await api.get(`/jobs/offers/guests?page=1&filters[0][field]=created_at&filters[0][value]=${(new Date).toISOString()}`, {
            headers: {
                Lang: getLanguage(),
                'Content-Type': 'application/json'
            },
            params: {
                page: 1
            }
        })
        return response.data.data

    } catch (error) {
        return Promise.reject(error.response.data.message)
    }
}
export {
    getPopularCategories,
    getAllCategories,
    getValidCountriesToSignupDetail,
    getUserIdentifier,
    getSingleCountryInfo,
    getFeaturedJobs,
    getExperiences,
    getPartners,
    getBlogs,
    getBlogSingle,
    getBlogSingleComment,
    getFAQs,
    getTerms,
    getCategoryDetailById,
    getJobWorktimes,
    getCountryInfoToSignup,
    getAboutUsDescription,
    getOverServices,
    getStatistics,
    postContactUs,
    getContactInfo,
    getAllJobs,
    getSpecificCompany,
    getSingleJob,
    getAllCorporations,
    getSpecificCorporation,
    getTopJobs,
    getCompanyDetailById,
    getHowWorks,
    getPolicies,
    getPricing,
    getChinaStates,
    getStateCities,
    getCandidateInfo,
    getCompanies,
    getAllJobOffers,
    getTodayJobs
}
