
const query = `

# Сброс серверного кеша
mutation clearCache{
  clearCache @storage(store:remote)
}

query SiteContent(
  $component:String
  $request:JSON!
  $geo:JSON!
){
  ...RootSiteContent
}

fragment RootSiteContent on RootType{
  siteContent(
    component:$component
    request:$request
    geo:$geo
  ){
    ...SiteContent
  }
}

fragment SiteContent on SiteContentType{
  id
  status
  title
  description
  keywords
  robots
  content
  state
  user
  _errors
  _isDirty
}

## Default
query EditorState {
  editorState{
    ...EditorState
  }
}

fragment EditorState on CommentEditorStateType{
  blocks{
    data
    depth
    entityRanges
    inlineStyleRanges
    key
    text
    type
  }
  entityMap{
    __typename
    
    ... on EditorEntityDefaultType{
      type
      mutability
      ...EditorEntity
    }
    
    ... on EditorEntityGalleryType{
      ...EditorEntityGallery
      type
      mutability
    }
    
    ... on EditorEntityLinkType{
      type
      data{
        target
        title
        url
        _map
      }
    }
    
    ... on EditorEntityImageType{
      type
      mutability
      data{
        src
      }
    }
    
  }
}

fragment EditorEntity on EditorEntityDefaultType{
  type
  mutability
  data{
    gallery{
      image
    }
    target
    title
    url
    _map
  }
}

fragment EditorEntityGallery on EditorEntityGalleryType{
  type
  mutability
  data{
    gallery{
      image
      imageFormats{
        thumb
        slider_thumb
        slider_dot_thumb
        middle
        big
      }
    }
  }
}


query Users(
  $usersLimit:Int = 10
  $getImageFormats:Boolean = false
  $withPagination:Boolean = false
  $usersSearchQuery:String
  $usersStorage:ReactCmsStorageStoreType = remote
){
  ...RootUsers
}


query CurrentUser(
  $currentUser:Boolean = true
  $userId:Int
  $userUsername:String
  $getImageFormats:Boolean = true
)
{
  ...RootUser  
}


query UserById(
  $currentUser:Boolean
  $userId:Int!
  $userUsername:String
  $getImageFormats:Boolean = true
)
{
  ...RootUser 
}


query UserByUsername(
  $currentUser:Boolean
  $userId:Int
  $userUsername:String!
  $getImageFormats:Boolean = true
)
{
  ...RootUser 
}


fragment RootUser on RootType{
  
	user(
    ownProfile:$currentUser
    id:$userId
    username:$userUsername
  ) @storage(store:remote)
  {
    ...User
  }
  
}


fragment User on ShopModxUserType {
  ...UserFields
}

fragment UserFields on ShopModxUserType{
  id
  username
  fullname
  email
  active
  sudo
  blocked
  createdon
  createdby
  delegate
  offer
  offer_date
  contract_date
  image
  imageFormats @include(if:$getImageFormats)
  {
    thumb
    small
    middle
    big
  }
  _isDirty
  _errors
}


# Все документы
query MODXResources(
  $modxResourcesLimit:Int = 10
  $modxResourcesPage:Int
  $withPagination:Boolean = false
  $modxResourcesContextKey:String = "web"
  $modxResourcesShowHidden:Boolean
  $modxResourcesShowUnpublished:Boolean
  $modxResourcesStorage:ReactCmsStorageStoreType
  $modxResourcesSort:[MODXResourceSortBy]
  $modxResourcesParent:Int
  $modxResourcesTemplates:[Int]
  $modxResourcesOptions:JSON
  $modxResourcesUri:String
  $getImageFormats:Boolean = false
)
{
  
  ...RootMODXResources
  
}


query MODXResourceById(
  $modxResourceId:Int!
  $getImageFormats:Boolean = false
  $modxResourcesShowHidden:Boolean
  $modxResourcesShowUnpublished:Boolean
)
{
  
  modxResource(
    id:$modxResourceId
    showhidden:$modxResourcesShowHidden
    showunpublished:$modxResourcesShowUnpublished
  ){
    ...MODXResource
  }
  
}

query MODXResourceByUri(
  $modxResourceUri:String!
  $getImageFormats:Boolean = false
  $modxResourcesShowHidden:Boolean
  $modxResourcesShowUnpublished:Boolean
)
{
  
  modxResource(
    uri:$modxResourceUri
    showhidden:$modxResourcesShowHidden
    showunpublished:$modxResourcesShowUnpublished
  ){
    ...MODXResource
  }
  
}

fragment RootMODXResources on RootType{
  
  modxResourcesList(
    limit: $modxResourcesLimit
    page: $modxResourcesPage
    context_key: $modxResourcesContextKey
    showhidden:$modxResourcesShowHidden
    showunpublished:$modxResourcesShowUnpublished
    parent:$modxResourcesParent
    templates:$modxResourcesTemplates
    uri:$modxResourcesUri
    sort:$modxResourcesSort
    options:$modxResourcesOptions
  ) 
    @include(if:$withPagination)
    @storage(store:$modxResourcesStorage)
  {
    count
    total
    limit
    page
    object{
      ...MODXResource
    }
  }
  
  modxResources(
    limit: $modxResourcesLimit
    page: $modxResourcesPage
    context_key: $modxResourcesContextKey
    showhidden:$modxResourcesShowHidden
    showunpublished:$modxResourcesShowUnpublished
    parent:$modxResourcesParent
    templates:$modxResourcesTemplates
    uri:$modxResourcesUri
    sort:$modxResourcesSort
    options:$modxResourcesOptions
  ) 
    @skip(if:$withPagination)
    @storage(store:$modxResourcesStorage)
  {
    ...MODXResource
  }
  
}

fragment MODXResource on MODXResourceType{
  
  ...MODXResourceFields
  
}

fragment MODXResourceFields on MODXResourceType{
  
  id
  pagetitle
  longtitle
  description
  alias
  link_attributes
  parent
  template
  menuindex
  menutitle
  content
  isfolder
  published
  createdby
  createdon
  publishedon
  publishedby
  pub_date
  unpub_date
  deleted
  deletedon
  deletedby
  editedon
  editedby
  hidemenu
  class_key
  context_key
  content_type
  richtext
  uri
  uri_override
  hide_children_in_tree
  show_in_tree
  price
  price_old
  article
  image
  imageFormats @include(if:$getImageFormats)
  {
    thumb
    slider_thumb
    slider_dot_thumb
    small
    middle
    big
  }
  properties
  tvs
  _other
  
}

fragment RootUsers on RootType{
	
  usersList(
    limit:$usersLimit
    search:$usersSearchQuery
  )
  @storage(store:$usersStorage)
  @include(if:$withPagination)
  {
    count
    total
    limit
    page
    object{
    	...User
    }
  }
	
  users(
    limit:$usersLimit
    search:$usersSearchQuery
  )
  @storage(store:$usersStorage)
  @skip(if:$withPagination)
  {
    ...User
  }
  
}


`;

export default query;
