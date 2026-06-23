import { FilterDefinition } from './query-builder';

export const filters: FilterDefinition[] = [
  {
    "field": "agent_type",
    "label": "Agent Type",
    "type": {
      "type": "enum",
      "allowed_values": [
        {
          "name": "workstation",
          "label": "Workstation"
        },
        {
          "name": "server",
          "label": "Server"
        }
      ]
    },
    "hive_type": "enum"
  },
  {
    "field": "agent_version",
    "label": "Agent Version",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "applications",
    "label": "Applications",
    "type": {
      "type": "array",
      "element_type": {
        "type": "struct",
        "fields": [
          {
            "name": "key",
            "label": "Key",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "source",
            "label": "Source",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "display_name",
            "label": "Display Name",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "display_version",
            "label": "Display Version",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "install_date",
            "label": "Install Date",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "install_source",
            "label": "Install Source",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "publisher",
            "label": "Publisher",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "estimated_size",
            "label": "Estimated Size",
            "type": {
              "type": "number"
            }
          }
        ]
      }
    },
    "hive_type": "array<struct<key:string,source:string,display_name:string,display_version:string,install_date:string,install_source:string,publisher:string,estimated_size:int>>"
  },
  {
    "field": "applications_count",
    "label": "Applications Count",
    "type": {
      "type": "number"
    },
    "hive_type": "int"
  },
  {
    "field": "applications_interval",
    "label": "Applications Interval",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "architecture",
    "label": "Architecture",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "bios_manufacturer",
    "label": "Bios Manufacturer",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "bios_name",
    "label": "Bios Name",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "bios_serial_number",
    "label": "Bios Serial Number",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "bios_version",
    "label": "Bios Version",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "build",
    "label": "Build",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "build_minor",
    "label": "Build Minor",
    "type": {
      "type": "number"
    },
    "hive_type": "int"
  },
  {
    "field": "bypass_s3_download",
    "label": "Bypass S3 Download",
    "type": {
      "type": "boolean"
    },
    "hive_type": "boolean"
  },
  {
    "field": "changed_by",
    "label": "Changed By",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "changed_on",
    "label": "Changed On",
    "type": {
      "type": "timestamp"
    },
    "hive_type": "timestamp"
  },
  {
    "field": "check_interval",
    "label": "Check Interval",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "cloned_from",
    "label": "Cloned From",
    "type": {
      "type": "uuid"
    },
    "hive_type": "uuid"
  },
  {
    "field": "cloud_information",
    "label": "Cloud Information",
    "type": {
      "type": "struct",
      "fields": [
        {
          "name": "azure",
          "label": "Azure",
          "type": {
            "type": "struct",
            "fields": [
              {
                "name": "mac",
                "label": "Mac",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "private_ip",
                "label": "Private Ip",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "public_ip",
                "label": "Public Ip",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "subscription_id",
                "label": "Subscription ID",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "az_environment",
                "label": "Az Environment",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "name",
                "label": "Name",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "offer",
                "label": "Offer",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "location",
                "label": "Location",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "osType",
                "label": "Ostype",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "publisher",
                "label": "Publisher",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "resource_id",
                "label": "Resource ID",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "resource_group_name",
                "label": "Resource Group Name",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "sku",
                "label": "Sku",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "version",
                "label": "Version",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "vm_id",
                "label": "Vm ID",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "vm_size",
                "label": "Vm Size",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "tags",
                "label": "Tags",
                "type": {
                  "type": "map",
                  "key_type": {
                    "type": "string"
                  },
                  "value_type": {
                    "type": "string"
                  }
                }
              }
            ]
          }
        },
        {
          "name": "ec2",
          "label": "Ec2",
          "type": {
            "type": "struct",
            "fields": [
              {
                "name": "account_id",
                "label": "Account ID",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "availability_zone",
                "label": "Availability Zone",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "image_id",
                "label": "Image ID",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "instance_id",
                "label": "Instance ID",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "instance_type",
                "label": "Instance Type",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "ipv6",
                "label": "Ipv6",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "life_cycle",
                "label": "Life Cycle",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "local_hostname",
                "label": "Local Hostname",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "mac",
                "label": "Mac",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "placement_group_name",
                "label": "Placement Group Name",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "placement_host_id",
                "label": "Placement Host ID",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "placement_partition_number",
                "label": "Placement Partition Number",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "private_dns_name",
                "label": "Private Dns Name",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "private_ip",
                "label": "Private Ip",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "public_dns_name",
                "label": "Public Dns Name",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "public_ip",
                "label": "Public Ip",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "region",
                "label": "Region",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "reservation_id",
                "label": "Reservation ID",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "vpc_id",
                "label": "Vpc ID",
                "type": {
                  "type": "string"
                }
              },
              {
                "name": "security_groups",
                "label": "Security Groups",
                "type": {
                  "type": "array",
                  "element_type": {
                    "type": "string"
                  }
                }
              },
              {
                "name": "subnets",
                "label": "Subnets",
                "type": {
                  "type": "array",
                  "element_type": {
                    "type": "string"
                  }
                }
              },
              {
                "name": "tags",
                "label": "Tags",
                "type": {
                  "type": "map",
                  "key_type": {
                    "type": "string"
                  },
                  "value_type": {
                    "type": "string"
                  }
                }
              }
            ]
          }
        }
      ]
    },
    "hive_type": "struct<azure:struct<mac:string,private_ip:string,public_ip:string,subscription_id:string,az_environment:string,name:string,offer:string,location:string,osType:string,publisher:string,resource_id:string,resource_group_name:string,sku:string,version:string,vm_id:string,vm_size:string,tags:map<string,string>>,ec2:struct<account_id:string,availability_zone:string,image_id:string,instance_id:string,instance_type:string,ipv6:string,life_cycle:string,local_hostname:string,mac:string,placement_group_name:string,placement_host_id:string,placement_partition_number:string,private_dns_name:string,private_ip:string,public_dns_name:string,public_ip:string,region:string,reservation_id:string,vpc_id:string,security_groups:array<string>,subnets:array<string>,tags:map<string,string>>>"
  },
  {
    "field": "config_set_id",
    "label": "Config Set ID",
    "type": {
      "type": "uuid"
    },
    "hive_type": "uuid"
  },
  {
    "field": "created_by",
    "label": "Created By",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "created_on",
    "label": "Created On",
    "type": {
      "type": "timestamp"
    },
    "hive_type": "timestamp"
  },
  {
    "field": "cwa_machine_id",
    "label": "Cwa Machine ID",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "debug_enabled",
    "label": "Debug Enabled",
    "type": {
      "type": "boolean"
    },
    "hive_type": "boolean"
  },
  {
    "field": "debug_enabled_until",
    "label": "Debug Enabled Until",
    "type": {
      "type": "timestamp"
    },
    "hive_type": "timestamp"
  },
  {
    "field": "description",
    "label": "Description",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "display_version",
    "label": "Display Version",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "domain",
    "label": "Domain",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "entity_id",
    "label": "Entity ID",
    "type": {
      "type": "uuid"
    },
    "hive_type": "uuid"
  },
  {
    "field": "force_retry",
    "label": "Force Retry",
    "type": {
      "type": "boolean"
    },
    "hive_type": "boolean"
  },
  {
    "field": "fqdn",
    "label": "Fqdn",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "has_issues",
    "label": "Has Issues",
    "type": {
      "type": "boolean"
    },
    "hive_type": "boolean"
  },
  {
    "field": "has_issues_since",
    "label": "Has Issues Since",
    "type": {
      "type": "timestamp"
    },
    "hive_type": "timestamp"
  },
  {
    "field": "has_unreachable",
    "label": "Has Unreachable",
    "type": {
      "type": "boolean"
    },
    "hive_type": "boolean"
  },
  {
    "field": "hostname",
    "label": "Hostname",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "is_snoozed",
    "label": "Is Snoozed",
    "type": {
      "type": "boolean"
    },
    "hive_type": "boolean"
  },
  {
    "field": "is_snoozed_until",
    "label": "Is Snoozed Until",
    "type": {
      "type": "timestamp"
    },
    "hive_type": "timestamp"
  },
  {
    "field": "last_boot_up_time",
    "label": "Last Boot Up Time",
    "type": {
      "type": "timestamp"
    },
    "hive_type": "timestamp"
  },
  {
    "field": "last_check_in",
    "label": "Last Check In",
    "type": {
      "type": "timestamp"
    },
    "hive_type": "timestamp"
  },
  {
    "field": "machine_guid",
    "label": "Machine Guid",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "machine_id",
    "label": "Machine ID",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "major_version",
    "label": "Major Version",
    "type": {
      "type": "number"
    },
    "hive_type": "int"
  },
  {
    "field": "marked_for_uninstall",
    "label": "Marked For Uninstall",
    "type": {
      "type": "boolean"
    },
    "hive_type": "boolean"
  },
  {
    "field": "minor_version",
    "label": "Minor Version",
    "type": {
      "type": "number"
    },
    "hive_type": "int"
  },
  {
    "field": "monitor_state",
    "label": "Monitor State",
    "type": {
      "type": "map",
      "key_type": {
        "type": "enum",
        "allowed_values": [
          {
            "name": "winlogbeat",
            "label": "Winlogbeat"
          },
          {
            "name": "auditbeat",
            "label": "Auditbeat"
          },
          {
            "name": "agent",
            "label": "Agent"
          }
        ]
      },
      "value_type": {
        "type": "struct",
        "fields": [
          {
            "name": "unreachable",
            "label": "Unreachable",
            "type": {
              "type": "boolean"
            }
          },
          {
            "name": "unreachable_since",
            "label": "Unreachable Since",
            "type": {
              "type": "timestamp"
            }
          },
          {
            "name": "service_running",
            "label": "Service Running",
            "type": {
              "type": "boolean"
            }
          },
          {
            "name": "service_not_running_since",
            "label": "Service Not Running Since",
            "type": {
              "type": "timestamp"
            }
          }
        ]
      }
    },
    "hive_type": "map<enum,struct<unreachable:boolean,unreachable_since:timestamp,service_running:boolean,service_not_running_since:timestamp>>"
  },
  {
    "field": "monitors",
    "label": "Monitors",
    "type": {
      "type": "map",
      "key_type": {
        "type": "enum",
        "allowed_values": [
          {
            "name": "winlogbeat",
            "label": "Winlogbeat"
          },
          {
            "name": "auditbeat",
            "label": "Auditbeat"
          },
          {
            "name": "agent",
            "label": "Agent"
          }
        ]
      },
      "value_type": {
        "type": "struct",
        "fields": [
          {
            "name": "enabled",
            "label": "Enabled",
            "type": {
              "type": "boolean"
            }
          },
          {
            "name": "monitor_interval",
            "label": "Monitor Interval",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "publish_interval",
            "label": "Publish Interval",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "publish_logs_interval",
            "label": "Publish Logs Interval",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "publish_errors",
            "label": "Publish Errors",
            "type": {
              "type": "boolean"
            }
          },
          {
            "name": "min_error_publish_interval",
            "label": "Min Error Publish Interval",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "min_retry_interval",
            "label": "Min Retry Interval",
            "type": {
              "type": "string"
            }
          }
        ]
      }
    },
    "hive_type": "map<enum,struct<enabled:boolean,monitor_interval:string,publish_interval:string,publish_logs_interval:string,publish_errors:boolean,min_error_publish_interval:string,min_retry_interval:string>>"
  },
  {
    "field": "name",
    "label": "Name",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "network_interfaces",
    "label": "Network Interfaces",
    "type": {
      "type": "array",
      "element_type": {
        "type": "struct",
        "fields": [
          {
            "name": "id",
            "label": "ID",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "name",
            "label": "Name",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "description",
            "label": "Description",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "network_interface_type",
            "label": "Network Interface Type",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "physical_address",
            "label": "Physical Address",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "status",
            "label": "Status",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "speed",
            "label": "Speed",
            "type": {
              "type": "number"
            }
          },
          {
            "name": "ipv4",
            "label": "Ipv4",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "ipv6",
            "label": "Ipv6",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "dns_addresses",
            "label": "Dns Addresses",
            "type": {
              "type": "array",
              "element_type": {
                "type": "string"
              }
            }
          },
          {
            "name": "dhcp_servers",
            "label": "Dhcp Servers",
            "type": {
              "type": "array",
              "element_type": {
                "type": "string"
              }
            }
          },
          {
            "name": "gateway_addresses",
            "label": "Gateway Addresses",
            "type": {
              "type": "array",
              "element_type": {
                "type": "string"
              }
            }
          },
          {
            "name": "dns_suffix",
            "label": "Dns Suffix",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "is_dns_enabled",
            "label": "Is Dns Enabled",
            "type": {
              "type": "boolean"
            }
          },
          {
            "name": "is_dynamic_dns_enabled",
            "label": "Is Dynamic Dns Enabled",
            "type": {
              "type": "boolean"
            }
          },
          {
            "name": "network",
            "label": "Network",
            "type": {
              "type": "struct",
              "fields": [
                {
                  "name": "id",
                  "label": "ID",
                  "type": {
                    "type": "string"
                  }
                },
                {
                  "name": "name",
                  "label": "Name",
                  "type": {
                    "type": "string"
                  }
                },
                {
                  "name": "description",
                  "label": "Description",
                  "type": {
                    "type": "string"
                  }
                },
                {
                  "name": "is_connected",
                  "label": "Is Connected",
                  "type": {
                    "type": "boolean"
                  }
                },
                {
                  "name": "is_connected_to_internet",
                  "label": "Is Connected To Internet",
                  "type": {
                    "type": "boolean"
                  }
                },
                {
                  "name": "connected_time",
                  "label": "Connected Time",
                  "type": {
                    "type": "timestamp"
                  }
                },
                {
                  "name": "created_time",
                  "label": "Created Time",
                  "type": {
                    "type": "timestamp"
                  }
                },
                {
                  "name": "domain_type",
                  "label": "Domain Type",
                  "type": {
                    "type": "string"
                  }
                },
                {
                  "name": "connectivity",
                  "label": "Connectivity",
                  "type": {
                    "type": "array",
                    "element_type": {
                      "type": "string"
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "hive_type": "array<struct<id:string,name:string,description:string,network_interface_type:string,physical_address:string,status:string,speed:int,ipv4:string,ipv6:string,dns_addresses:array<string>,dhcp_servers:array<string>,gateway_addresses:array<string>,dns_suffix:string,is_dns_enabled:boolean,is_dynamic_dns_enabled:boolean,network:struct<id:string,name:string,description:string,is_connected:boolean,is_connected_to_internet:boolean,connected_time:timestamp,created_time:timestamp,domain_type:string,connectivity:array<string>>>>"
  },
  {
    "field": "network_interfaces_count",
    "label": "Network Interfaces Count",
    "type": {
      "type": "number"
    },
    "hive_type": "int"
  },
  {
    "field": "principal_user",
    "label": "Principal User",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "processes_interval",
    "label": "Processes Interval",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "product_name",
    "label": "Product Name",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "publish_interval",
    "label": "Publish Interval",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "registered_user",
    "label": "Registered User",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "serial_number",
    "label": "Serial Number",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "services",
    "label": "Services",
    "type": {
      "type": "array",
      "element_type": {
        "type": "struct",
        "fields": [
          {
            "name": "name",
            "label": "Name",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "display_name",
            "label": "Display Name",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "description",
            "label": "Description",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "start_mode",
            "label": "Start Mode",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "status",
            "label": "Status",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "state",
            "label": "State",
            "type": {
              "type": "string"
            }
          },
          {
            "name": "process_id",
            "label": "Process ID",
            "type": {
              "type": "number"
            }
          },
          {
            "name": "process",
            "label": "Process",
            "type": {
              "type": "struct",
              "fields": [
                {
                  "name": "id",
                  "label": "ID",
                  "type": {
                    "type": "number"
                  }
                },
                {
                  "name": "parent_id",
                  "label": "Parent ID",
                  "type": {
                    "type": "number"
                  }
                },
                {
                  "name": "creation_date",
                  "label": "Creation Date",
                  "type": {
                    "type": "string"
                  }
                },
                {
                  "name": "caption",
                  "label": "Caption",
                  "type": {
                    "type": "string"
                  }
                },
                {
                  "name": "executable_path",
                  "label": "Executable Path",
                  "type": {
                    "type": "string"
                  }
                },
                {
                  "name": "command_line",
                  "label": "Command Line",
                  "type": {
                    "type": "string"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "hive_type": "array<struct<name:string,display_name:string,description:string,start_mode:string,status:string,state:string,process_id:int,process:struct<id:int,parent_id:int,creation_date:string,caption:string,executable_path:string,command_line:string>>>"
  },
  {
    "field": "services_count",
    "label": "Services Count",
    "type": {
      "type": "number"
    },
    "hive_type": "int"
  },
  {
    "field": "services_interval",
    "label": "Services Interval",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "silenced",
    "label": "Silenced",
    "type": {
      "type": "boolean"
    },
    "hive_type": "boolean"
  },
  {
    "field": "sm_bios_version",
    "label": "Sm Bios Version",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  },
  {
    "field": "tags",
    "label": "Tags",
    "type": {
      "type": "map",
      "key_type": {
        "type": "string"
      },
      "value_type": {
        "type": "string"
      }
    },
    "hive_type": "map<string,string>"
  },
  {
    "field": "tenant_id",
    "label": "Tenant ID",
    "type": {
      "type": "string"
    },
    "hive_type": "string"
  }
];
